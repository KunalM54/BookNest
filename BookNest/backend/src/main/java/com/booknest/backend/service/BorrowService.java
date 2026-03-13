package com.booknest.backend.service;

import com.booknest.backend.model.Book;
import com.booknest.backend.model.Borrow;
import com.booknest.backend.model.User;
import com.booknest.backend.repository.BookRepository;
import com.booknest.backend.repository.BorrowRepository;
import com.booknest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BorrowService {

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all borrow requests
    public List<Borrow> getAllRequests() {
        return borrowRepository.findAllByOrderByRequestDateDesc();
    }

    // Get pending requests
    public List<Borrow> getPendingRequests() {
        return borrowRepository.findByStatusOrderByRequestDateDesc(Borrow.BorrowStatus.PENDING);
    }

    // Get requests by status
    public List<Borrow> getRequestsByStatus(Borrow.BorrowStatus status) {
        return borrowRepository.findByStatusOrderByRequestDateDesc(status);
    }

    // Create new borrow request
    @Transactional
    public Map<String, Object> createRequest(Long studentId, Long bookId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> studentOpt = userRepository.findById(studentId);
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        
        if (!studentOpt.isPresent()) {
            response.put("success", false);
            response.put("message", "Student not found");
            return response;
        }
        
        if (!bookOpt.isPresent()) {
            response.put("success", false);
            response.put("message", "Book not found");
            return response;
        }
        
        User student = studentOpt.get();
        Book book = bookOpt.get();
        
        if (!student.isActive()) {
            response.put("success", false);
            response.put("message", "Student account is blocked");
            return response;
        }
        
        if (book.getAvailableCopies() <= 0) {
            response.put("success", false);
            response.put("message", "No available copies");
            return response;
        }
        
        Borrow borrow = new Borrow();
        borrow.setStudent(student);
        borrow.setBook(book);
        borrow.setRequestDate(LocalDate.now());
        borrow.setStatus(Borrow.BorrowStatus.PENDING);
        
        borrowRepository.save(borrow);
        
        response.put("success", true);
        response.put("message", "Borrow request created successfully");
        response.put("borrow", borrow);
        return response;
    }

    // Approve borrow request
    @Transactional
    public Map<String, Object> approveRequest(Long id) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Borrow> borrowOpt = borrowRepository.findById(id);
        
        if (!borrowOpt.isPresent()) {
            response.put("success", false);
            response.put("message", "Borrow request not found");
            return response;
        }
        
        Borrow borrow = borrowOpt.get();
        
        if (borrow.getStatus() != Borrow.BorrowStatus.PENDING) {
            response.put("success", false);
            response.put("message", "Request is not pending");
            return response;
        }
        
        Book book = borrow.getBook();
        if (book.getAvailableCopies() <= 0) {
            response.put("success", false);
            response.put("message", "No available copies");
            return response;
        }
        
        // Update book available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);
        
        // Update borrow status
        borrow.setStatus(Borrow.BorrowStatus.APPROVED);
        borrow.setDueDate(LocalDate.now().plusDays(14)); // 2 weeks due date
        
        borrowRepository.save(borrow);
        
        response.put("success", true);
        response.put("message", "Borrow request approved");
        response.put("borrow", borrow);
        return response;
    }

    // Reject borrow request
    @Transactional
    public Map<String, Object> rejectRequest(Long id) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Borrow> borrowOpt = borrowRepository.findById(id);
        
        if (!borrowOpt.isPresent()) {
            response.put("success", false);
            response.put("message", "Borrow request not found");
            return response;
        }
        
        Borrow borrow = borrowOpt.get();
        borrow.setStatus(Borrow.BorrowStatus.REJECTED);
        borrowRepository.save(borrow);
        
        response.put("success", true);
        response.put("message", "Borrow request rejected");
        response.put("borrow", borrow);
        return response;
    }

    // Return book
    @Transactional
    public Map<String, Object> returnBook(Long id) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Borrow> borrowOpt = borrowRepository.findById(id);
        
        if (!borrowOpt.isPresent()) {
            response.put("success", false);
            response.put("message", "Borrow request not found");
            return response;
        }
        
        Borrow borrow = borrowOpt.get();
        
        if (borrow.getStatus() != Borrow.BorrowStatus.APPROVED) {
            response.put("success", false);
            response.put("message", "Cannot return - request not approved");
            return response;
        }
        
        // Update book available copies
        Book book = borrow.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
        
        // Update borrow status
        borrow.setStatus(Borrow.BorrowStatus.RETURNED);
        borrow.setReturnDate(LocalDate.now());
        
        borrowRepository.save(borrow);
        
        response.put("success", true);
        response.put("message", "Book returned successfully");
        response.put("borrow", borrow);
        return response;
    }

    // Delete/Remove borrow request
    @Transactional
    public Map<String, Object> deleteRequest(Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (!borrowRepository.existsById(id)) {
            response.put("success", false);
            response.put("message", "Borrow request not found");
            return response;
        }
        
        borrowRepository.deleteById(id);
        
        response.put("success", true);
        response.put("message", "Borrow request removed");
        return response;
    }

    // Get dashboard statistics
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        Long totalBooks = bookRepository.count();
        Long totalStudents = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT && u.isActive())
                .count();
        Long booksIssued = borrowRepository.countApprovedBorrows();
        Long overdueBooks = borrowRepository.countOverdueBorrows();
        
        stats.put("totalBooks", totalBooks);
        stats.put("activeMembers", totalStudents);
        stats.put("booksIssued", booksIssued);
        stats.put("overdueBooks", overdueBooks);
        
        return stats;
    }

    // Get recent borrow requests for dashboard
    public List<Borrow> getRecentRequests(int limit) {
        return borrowRepository.findAllByOrderByRequestDateDesc()
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<Borrow> getMyBooks(Long studentId) {
        return borrowRepository.findMyBooksByStudentId(studentId);
    }

    public List<Borrow> getHistory(Long studentId) {
        return borrowRepository.findHistoryByStudentId(studentId);
    }

    public List<Borrow> getRequests(Long studentId) {
        return borrowRepository.findRequestsByStudentId(studentId);
    }
}

