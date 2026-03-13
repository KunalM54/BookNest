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

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = com.booknest.backend.model.Borrow.BorrowStatus.APPROVED")
    Long countApprovedBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = com.booknest.backend.model.Borrow.BorrowStatus.RETURNED")
    Long countReturnedBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = com.booknest.backend.model.Borrow.BorrowStatus.OVERDUE")
    Long countOverdueBorrows();

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.student = :student")
    Long countByStudent(User student);

    List<Borrow> findByStudent(User student);
    
    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId AND b.status = 'APPROVED' ORDER BY b.requestDate DESC")
    List<Borrow> findMyBooksByStudentId(Long studentId);
    
    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId ORDER BY b.requestDate DESC")
    List<Borrow> findHistoryByStudentId(Long studentId);
    
    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId AND b.status = 'PENDING' ORDER BY b.requestDate DESC")
    List<Borrow> findRequestsByStudentId(Long studentId);
}

