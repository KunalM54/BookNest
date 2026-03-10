package com.booknest.backend.controller;

import com.booknest.backend.model.Notice;
import com.booknest.backend.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "*")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // Get all notices
    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    // Get notice by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
        return noticeService.getNoticeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new notice
    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotice(@RequestBody Notice notice) {
        Map<String, Object> response = new HashMap<>();
        
        if (notice.getTitle() == null || notice.getTitle().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Title is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        Notice savedNotice = noticeService.createNotice(notice);
        response.put("success", true);
        response.put("message", "Notice created successfully");
        response.put("notice", savedNotice);
        return ResponseEntity.ok(response);
    }

    // Update notice
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNotice(@PathVariable Long id, @RequestBody Notice noticeDetails) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Notice updatedNotice = noticeService.updateNotice(id, noticeDetails);
            response.put("success", true);
            response.put("message", "Notice updated successfully");
            response.put("notice", updatedNotice);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Delete notice
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotice(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            noticeService.deleteNotice(id);
            response.put("success", true);
            response.put("message", "Notice deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Get important notices only
    @GetMapping("/important")
    public ResponseEntity<List<Notice>> getImportantNotices() {
        return ResponseEntity.ok(noticeService.getImportantNotices());
    }
}

