package com.booknest.backend.repository;

import com.booknest.backend.model.Borrow;
import com.booknest.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    List<Borrow> findAllByOrderByRequestDateDesc();

    List<Borrow> findByStatus(Borrow.BorrowStatus status);

    List<Borrow> findByStatusOrderByRequestDateDesc(Borrow.BorrowStatus status);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = 'APPROVED'")
    Long countApprovedBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = 'RETURNED'")
    Long countReturnedBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = 'OVERDUE'")
    Long countOverdueBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.student = :student")
    Long countByStudent(User student);

    List<Borrow> findByStudent(User student);
}

