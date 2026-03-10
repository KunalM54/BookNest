package com.booknest.backend.service;

import com.booknest.backend.model.Notice;
import com.booknest.backend.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    // Get all notices ordered by date (newest first)
    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get notice by ID
    public Optional<Notice> getNoticeById(Long id) {
        return noticeRepository.findById(id);
    }

    // Create new notice
    public Notice createNotice(Notice notice) {
        notice.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    // Update existing notice
    public Notice updateNotice(Long id, Notice noticeDetails) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + id));
        
        notice.setTitle(noticeDetails.getTitle());
        notice.setMessage(noticeDetails.getMessage());
        notice.setImportant(noticeDetails.isImportant());
        
        return noticeRepository.save(notice);
    }

    // Delete notice
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new RuntimeException("Notice not found with id: " + id);
        }
        noticeRepository.deleteById(id);
    }

    // Get important notices only
    public List<Notice> getImportantNotices() {
        return noticeRepository.findByIsImportantTrueOrderByCreatedAtDesc();
    }
}

