package com.booknest.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentIdNumber;
    private String studentEmail;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookIsbn;
    private LocalDate requestDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private LocalDate actionDate;
    private String status;
}

