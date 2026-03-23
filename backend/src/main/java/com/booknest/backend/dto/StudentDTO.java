package com.booknest.backend.dto;

public class StudentDTO {
    private Long id;
    private String fullName;
    private String studentId;
    private String email;
    private String role;
    private boolean active;
    private Long borrowedCount;

    public StudentDTO() {}

    public StudentDTO(Long id, String fullName, String studentId, String email,
            String role, boolean active, Long borrowedCount) {
        this.id = id;
        this.fullName = fullName;
        this.studentId = studentId;
        this.email = email;
        this.role = role;
        this.active = active;
        this.borrowedCount = borrowedCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Long getBorrowedCount() { return borrowedCount; }
    public void setBorrowedCount(Long borrowedCount) { this.borrowedCount = borrowedCount; }
}
