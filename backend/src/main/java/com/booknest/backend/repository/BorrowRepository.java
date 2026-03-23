package com.booknest.backend.repository;

import com.booknest.backend.model.Borrow;
import com.booknest.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.book.id = :bookId AND b.status IN (com.booknest.backend.model.Borrow.BorrowStatus.PENDING, com.booknest.backend.model.Borrow.BorrowStatus.APPROVED, com.booknest.backend.model.Borrow.BorrowStatus.OVERDUE)")
    long countActiveBorrowsForBook(Long bookId);

    List<Borrow> findAllByOrderByRequestDateDesc();

    List<Borrow> findByStatus(Borrow.BorrowStatus status);

    List<Borrow> findByStatusOrderByRequestDateDesc(Borrow.BorrowStatus status);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = com.booknest.backend.model.Borrow.BorrowStatus.APPROVED")
    Long countApprovedBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = com.booknest.backend.model.Borrow.BorrowStatus.RETURNED")
    Long countReturnedBorrows();

    // FIX: Count overdue by checking APPROVED records where due_date has passed (no
    // scheduler needed)
    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = com.booknest.backend.model.Borrow.BorrowStatus.APPROVED AND b.dueDate < CURRENT_DATE")
    Long countOverdueBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.student = :student")
    Long countByStudent(User student);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.student = :student AND b.status IN (com.booknest.backend.model.Borrow.BorrowStatus.PENDING, com.booknest.backend.model.Borrow.BorrowStatus.APPROVED, com.booknest.backend.model.Borrow.BorrowStatus.OVERDUE)")
    Long countActiveByStudent(User student);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.student = :student AND b.status = com.booknest.backend.model.Borrow.BorrowStatus.RETURNED")
    Long countReturnedByStudent(User student);

    List<Borrow> findByStudent(User student);

    // FIX: Include OVERDUE status so student's overdue books appear in My Books
    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId AND b.status IN ('APPROVED', 'OVERDUE') ORDER BY b.requestDate DESC")
    List<Borrow> findMyBooksByStudentId(Long studentId);

    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId ORDER BY b.requestDate DESC")
    List<Borrow> findHistoryByStudentId(Long studentId);

    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId AND b.status = 'PENDING' ORDER BY b.requestDate DESC")
    List<Borrow> findRequestsByStudentId(Long studentId);

    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId AND b.status IN ('PENDING','APPROVED','REJECTED') ORDER BY b.requestDate DESC")
    List<Borrow> findRequestsHistoryByStudentId(Long studentId);

    @Query("SELECT COUNT(b) > 0 FROM Borrow b WHERE b.student.id = :studentId AND b.book.id = :bookId AND b.status IN :statuses")
    boolean existsByStudentIdAndBookIdAndStatusIn(Long studentId, Long bookId, List<Borrow.BorrowStatus> statuses);

    @Query("SELECT b.book.title, COUNT(b) as cnt FROM Borrow b GROUP BY b.book.id, b.book.title ORDER BY cnt DESC")
    List<Object[]> findTopBorrowedBooks();

    @Query("SELECT b.student.fullName, COUNT(b) as cnt FROM Borrow b GROUP BY b.student.id, b.student.fullName ORDER BY cnt DESC")
    List<Object[]> findMostActiveStudents();

    @Query("SELECT b FROM Borrow b WHERE b.status = 'OVERDUE'")
    List<Borrow> findOverdueBooks();

    @Query("SELECT b.book.title, COUNT(b) as cnt FROM Borrow b GROUP BY b.book.id, b.book.title ORDER BY cnt ASC")
    List<Object[]> findLeastUsedBooks();

    @Query(value = "SELECT CAST(b.request_date AS DATE), COUNT(*) FROM borrows b WHERE b.status IN ('APPROVED', 'RETURNED', 'OVERDUE') AND b.request_date >= :startDate GROUP BY CAST(b.request_date AS DATE) ORDER BY CAST(b.request_date AS DATE)", nativeQuery = true)
    List<Object[]> findIssuedTrend(LocalDate startDate);
}