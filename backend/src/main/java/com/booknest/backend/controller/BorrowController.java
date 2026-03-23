package com.booknest.backend.controller;

import com.booknest.backend.dto.BorrowDTO;
import com.booknest.backend.model.Borrow;
import com.booknest.backend.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "*")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    // Get all borrow requests
    @GetMapping("/requests")
    public ResponseEntity<List<BorrowDTO>> getAllRequests() {
        List<Borrow> requests = borrowService.getAllRequests();
        List<BorrowDTO> dtos = requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get pending requests only
    @GetMapping("/pending")
    public ResponseEntity<List<BorrowDTO>> getPendingRequests() {
        List<Borrow> requests = borrowService.getPendingRequests();
        List<BorrowDTO> dtos = requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get requests by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BorrowDTO>> getRequestsByStatus(@PathVariable String status) {
        try {
            Borrow.BorrowStatus borrowStatus = Borrow.BorrowStatus.valueOf(status.toUpperCase());
            List<Borrow> requests = borrowService.getRequestsByStatus(borrowStatus);
            List<BorrowDTO> dtos = requests.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Create new borrow request
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> createRequest(
            @RequestParam Long studentId,
            @RequestParam Long bookId) {
        Map<String, Object> result = borrowService.createRequest(studentId, bookId);
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    // Approve borrow request
    @PutMapping("/approve/{id}")
    public ResponseEntity<Map<String, Object>> approveRequest(@PathVariable Long id) {
        Map<String, Object> result = borrowService.approveRequest(id);
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    // Reject borrow request
    @PutMapping("/reject/{id}")
    public ResponseEntity<Map<String, Object>> rejectRequest(@PathVariable Long id) {
        Map<String, Object> result = borrowService.rejectRequest(id);
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    // Return book
    @PutMapping("/return/{id}")
    public ResponseEntity<Map<String, Object>> returnBook(@PathVariable Long id) {
        Map<String, Object> result = borrowService.returnBook(id);
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    // Remove/Delete borrow request
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Map<String, Object>> removeRequest(@PathVariable Long id) {
        Map<String, Object> result = borrowService.deleteRequest(id);
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    // Get dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(borrowService.getStats());
    }

    // Get recent requests for dashboard
    @GetMapping("/recent")
    public ResponseEntity<List<BorrowDTO>> getRecentRequests(@RequestParam(defaultValue = "5") int limit) {
        List<Borrow> requests = borrowService.getRecentRequests(limit);
        List<BorrowDTO> dtos = requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get student my books (approved + overdue borrows)
    @GetMapping("/my-books")
    public ResponseEntity<List<BorrowDTO>> getMyBooks(@RequestParam Long userId) {
        List<Borrow> borrows = borrowService.getMyBooks(userId);
        List<BorrowDTO> dtos = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get student borrow history
    @GetMapping("/history")
    public ResponseEntity<List<BorrowDTO>> getHistory(@RequestParam Long userId) {
        List<Borrow> borrows = borrowService.getHistory(userId);
        List<BorrowDTO> dtos = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get student pending requests
    @GetMapping("/my-requests")
    public ResponseEntity<List<BorrowDTO>> getMyRequests(@RequestParam Long userId) {
        List<Borrow> borrows = borrowService.getRequests(userId);
        List<BorrowDTO> dtos = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get student request history (pending + approved + rejected)
    @GetMapping("/my-requests/history")
    public ResponseEntity<List<BorrowDTO>> getMyRequestHistory(@RequestParam Long userId) {
        List<Borrow> borrows = borrowService.getRequestsHistory(userId);
        List<BorrowDTO> dtos = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Helper method to convert Borrow entity to DTO
    // FIX: Uses getDisplayStatus() so frontend receives correct status (OVERDUE,
    // RETURNED_LATE, etc.)
    private BorrowDTO convertToDTO(Borrow borrow) {
        BorrowDTO dto = new BorrowDTO();
        dto.setId(borrow.getId());
        dto.setStudentId(borrow.getStudent().getId());
        dto.setStudentName(borrow.getStudent().getFullName());
        dto.setStudentIdNumber(borrow.getStudent().getStudentId());
        dto.setStudentEmail(borrow.getStudent().getEmail());
        dto.setBookId(borrow.getBook().getId());
        dto.setBookTitle(borrow.getBook().getTitle());
        dto.setBookAuthor(borrow.getBook().getAuthor());
        dto.setBookIsbn(borrow.getBook().getIsbn());
        dto.setBookImage(borrow.getBook().getImageData());
        dto.setRequestDate(borrow.getRequestDate());
        dto.setDueDate(borrow.getDueDate());
        dto.setReturnDate(borrow.getReturnDate());
        dto.setActionDate(borrow.getActionDate());
        dto.setStatus(borrow.getDisplayStatus());
        return dto;
    }
}