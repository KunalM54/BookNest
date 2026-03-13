package com.booknest.backend.controller;

import com.booknest.backend.model.Book;
import com.booknest.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    private String normalizeImageData(String imageData) {
        if (imageData == null) {
            return null;
        }

        String trimmedImageData = imageData.trim();
        return trimmedImageData.isEmpty() ? null : trimmedImageData;
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookRepository.findAll());
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add new book
    @PostMapping
    public ResponseEntity<Map<String, Object>> addBook(@RequestBody Book book) {
        Map<String, Object> response = new HashMap<>();
        
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Title is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (book.getIsbn() == null || book.getIsbn().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "ISBN is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            response.put("success", false);
            response.put("message", "ISBN already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (book.getTotalCopies() == null || book.getTotalCopies() < 1) {
            book.setTotalCopies(1);
        }
        
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }

        if (book.getAvailableCopies() > book.getTotalCopies()) {
            book.setAvailableCopies(book.getTotalCopies());
        }

        book.setImageData(normalizeImageData(book.getImageData()));
        
        Book savedBook = bookRepository.save(book);
        response.put("success", true);
        response.put("message", "Book added successfully");
        response.put("book", savedBook);
        return ResponseEntity.ok(response);
    }

    // Update book
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        Map<String, Object> response = new HashMap<>();
        
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(bookDetails.getTitle());
                    book.setAuthor(bookDetails.getAuthor());
                    book.setCategory(bookDetails.getCategory());
                    book.setImageData(normalizeImageData(bookDetails.getImageData()));
                    if (bookDetails.getTotalCopies() != null) {
                        book.setTotalCopies(bookDetails.getTotalCopies());
                    }
                    if (bookDetails.getAvailableCopies() != null) {
                        book.setAvailableCopies(bookDetails.getAvailableCopies());
                    }

                    if (book.getTotalCopies() != null && book.getAvailableCopies() != null
                            && book.getAvailableCopies() > book.getTotalCopies()) {
                        book.setAvailableCopies(book.getTotalCopies());
                    }
                    
                    Book updatedBook = bookRepository.save(book);
                    response.put("success", true);
                    response.put("message", "Book updated successfully");
                    response.put("book", updatedBook);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Book not found");
                    return ResponseEntity.notFound().build();
                });
    }

    // Delete book
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBook(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (!bookRepository.existsById(id)) {
            response.put("success", false);
            response.put("message", "Book not found");
            return ResponseEntity.notFound().build();
        }
        
        bookRepository.deleteById(id);
        response.put("success", true);
        response.put("message", "Book deleted successfully");
        return ResponseEntity.ok(response);
    }
}
