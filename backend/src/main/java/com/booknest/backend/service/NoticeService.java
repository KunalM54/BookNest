package com.booknest.backend.service;

import com.booknest.backend.model.Notice;
import com.booknest.backend.model.NoticePriority;
import com.booknest.backend.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    // Get all notices ordered by date (newest first)
    @Transactional
    public List<Notice> getAllNotices() {
        backfillLegacyNoticeSchema();
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get notice by ID
    @Transactional
    public Optional<Notice> getNoticeById(Long id) {
        backfillLegacyNoticeSchema();
        return noticeRepository.findById(id);
    }

    // Create new notice
    @Transactional
    public Notice createNotice(Notice notice) {
        notice.setTitle(sanitizeText(notice.getTitle()));
        notice.setMessage(sanitizeText(notice.getMessage()));
        notice.setPriority(notice.getPriority());
        notice.setCreatedAt(LocalDateTime.now());
        notice.setUpdatedAt(notice.getCreatedAt());
        return noticeRepository.save(notice);
    }

    // Update existing notice
    @Transactional
    public Notice updateNotice(Long id, Notice noticeDetails) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + id));
        
        notice.setTitle(sanitizeText(noticeDetails.getTitle()));
        notice.setMessage(sanitizeText(noticeDetails.getMessage()));
        notice.setPriority(noticeDetails.getPriority());
        notice.setUpdatedAt(LocalDateTime.now());
        
        return noticeRepository.save(notice);
    }

    // Delete notice
    @Transactional
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new RuntimeException("Notice not found with id: " + id);
        }
        noticeRepository.deleteById(id);
    }

    // Get important notices only
    @Transactional
    public List<Notice> getImportantNotices() {
        backfillLegacyNoticeSchema();
        return noticeRepository.findByPriorityOrderByCreatedAtDesc(NoticePriority.HIGH);
    }

    private void backfillLegacyNoticeSchema() {
        List<Notice> noticesToUpdate = noticeRepository.findByPriorityIsNullOrUpdatedAtIsNull();

        if (noticesToUpdate.isEmpty()) {
            return;
        }

        noticesToUpdate.stream()
                .filter(Notice::needsSchemaBackfill)
                .forEach(Notice::backfillSchemaFields);

        noticeRepository.saveAll(noticesToUpdate);
    }

    private String sanitizeText(String value) {
        return value == null ? null : value.trim();
    }
}

