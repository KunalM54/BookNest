package com.booknest.backend.repository;

import com.booknest.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    boolean existsByIsbn(String isbn);
    
    List<Book> findByCategory(String category);
    
    @Query("SELECT b.category, COUNT(b) FROM Book b GROUP BY b.category")
    List<Object[]> countByCategoryGrouped();

    @Query("SELECT b FROM Book b ORDER BY b.addedDate DESC")
    List<Book> findRecentBooks();

    @Query("SELECT b FROM Book b WHERE b.addedDate >= :startDate ORDER BY b.addedDate DESC")
    List<Book> findRecentlyAdded(LocalDate startDate);
}
