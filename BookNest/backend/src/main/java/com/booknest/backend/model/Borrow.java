package com.booknest.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "borrows", indexes = {
    @Index(name = "idx_borrows_due_date", columnList = "due_date"),
    @Index(name = "idx_borrows_status", columnList = "status"),
    @Index(name = "idx_borrows_student_id", columnList = "student_id")
})
public class Borrow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "action_date")
    private LocalDate actionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowStatus status = BorrowStatus.PENDING;

    public enum BorrowStatus {
        PENDING, APPROVED, REJECTED, RETURNED, OVERDUE
    }

    public Borrow() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public LocalDate getActionDate() { return actionDate; }
    public void setActionDate(LocalDate actionDate) { this.actionDate = actionDate; }

    public BorrowStatus getStatus() { return status; }
    public void setStatus(BorrowStatus status) { this.status = status; }

    public String getDisplayStatus() {
        LocalDate today = LocalDate.now();
        switch (this.status) {
            case PENDING: return "PENDING";
            case REJECTED: return "REJECTED";
            case OVERDUE: return "OVERDUE";
            case APPROVED:
                if (this.dueDate != null && this.returnDate == null && today.isAfter(this.dueDate)) {
                    return "OVERDUE";
                }
                return "BORROWED";
            case RETURNED:
                if (this.returnDate != null && this.dueDate != null && this.returnDate.isAfter(this.dueDate)) {
                    return "RETURNED_LATE";
                }
                return "RETURNED_ON_TIME";
            default: return "UNKNOWN";
        }
    }

    public boolean isOverdue() {
        if (this.dueDate == null) return false;
        if (this.returnDate != null) return false;
        return LocalDate.now().isAfter(this.dueDate);
    }

    public boolean isReturnedLate() {
        if (this.returnDate == null || this.dueDate == null) return false;
        return this.returnDate.isAfter(this.dueDate);
    }
}
