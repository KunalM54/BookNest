package com.booknest.backend.repository;

import com.booknest.backend.model.Notice;
import com.booknest.backend.model.NoticePriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    
    // Find all notices ordered by created date descending (newest first)
    List<Notice> findAllByOrderByCreatedAtDesc();
    
    // Find important notices ordered by created date
    List<Notice> findByPriorityOrderByCreatedAtDesc(NoticePriority priority);

    List<Notice> findByPriorityIsNullOrUpdatedAtIsNull();
}

