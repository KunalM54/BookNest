package com.booknest.backend.controller;

import com.booknest.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // Get report statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(reportService.getReportStats());
    }

    // Get category statistics for bar chart
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategoryStats() {
        return ResponseEntity.ok(reportService.getCategoryStats());
    }

    // Get recent activities
    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getActivities() {
        return ResponseEntity.ok(reportService.getAllActivities());
    }

    // Get top borrowed books
    @GetMapping("/top-books")
    public ResponseEntity<List<Map<String, Object>>> getTopBorrowedBooks() {
        return ResponseEntity.ok(reportService.getTopBorrowedBooks());
    }

    // Get most active students
    @GetMapping("/active-students")
    public ResponseEntity<List<Map<String, Object>>> getMostActiveStudents() {
        return ResponseEntity.ok(reportService.getMostActiveStudents());
    }

    // Get overdue books
    @GetMapping("/overdue")
    public ResponseEntity<List<Map<String, Object>>> getOverdueBooks() {
        return ResponseEntity.ok(reportService.getOverdueBooks());
    }

    // Get least used books
    @GetMapping("/least-used")
    public ResponseEntity<List<Map<String, Object>>> getLeastUsedBooks() {
        return ResponseEntity.ok(reportService.getLeastUsedBooks());
    }

    // Get analytics data (stats for dashboard)
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(reportService.getAnalytics());
    }

    // Get inventory overview
    @GetMapping("/inventory")
    public ResponseEntity<Map<String, Object>> getInventoryOverview() {
        return ResponseEntity.ok(reportService.getInventoryOverview());
    }

    // Get books issued trend
    @GetMapping("/trend")
    public ResponseEntity<List<Map<String, Object>>> getIssuedTrend() {
        return ResponseEntity.ok(reportService.getIssuedTrend());
    }

    // Get category stats with count
    @GetMapping("/categories-detailed")
    public ResponseEntity<List<Map<String, Object>>> getCategoryStatsWithCount() {
        return ResponseEntity.ok(reportService.getCategoryStatsWithCount());
    }

    // Get recently added books
    @GetMapping("/recent-books")
    public ResponseEntity<List<Map<String, Object>>> getRecentlyAddedBooks() {
        return ResponseEntity.ok(reportService.getRecentlyAddedBooks());
    }
}

