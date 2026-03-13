package com.booknest.backend.service;

import com.booknest.backend.model.Borrow;
import com.booknest.backend.model.User;
import com.booknest.backend.repository.BookRepository;
import com.booknest.backend.repository.BorrowRepository;
import com.booknest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private UserRepository userRepository;

    // Get report statistics
    public Map<String, Object> getReportStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total books
        Long totalBooks = bookRepository.count();
        
        // Books issued (approved borrows)
        Long booksIssued = borrowRepository.countApprovedBorrows();
        
        // Overdue books
        Long overdueBooks = borrowRepository.countOverdueBorrows();
        
        // Active students (students with role STUDENT and active = true)
        Long activeStudents = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT && u.isActive())
                .count();
        
        stats.put("totalBooks", totalBooks);
        stats.put("booksIssued", booksIssued);
        stats.put("overdueBooks", overdueBooks);
        stats.put("activeStudents", activeStudents);
        
        return stats;
    }

    // Get category statistics for bar chart
    public List<Map<String, Object>> getCategoryStats() {
        List<Object[]> groupedResults = bookRepository.countByCategoryGrouped();
        List<Map<String, Object>> categoryStats = new ArrayList<>();
        
        // Get total books for percentage calculation
        long totalBooks = bookRepository.count();
        
        for (Object[] result : groupedResults) {
            String category = (String) result[0];
            Long count = (Long) result[1];
            
            Map<String, Object> catStat = new HashMap<>();
            catStat.put("name", category);
            catStat.put("count", totalBooks > 0 ? (count * 100 / totalBooks) : 0);
            categoryStats.add(catStat);
        }
        
        // Sort by count descending
        categoryStats.sort((a, b) -> {
            Number bCount = (Number) b.get("count");
            Number aCount = (Number) a.get("count");
            int bVal = bCount == null ? 0 : bCount.intValue();
            int aVal = aCount == null ? 0 : aCount.intValue();
            return Integer.compare(bVal, aVal);
        });
        
        return categoryStats;
    }

    // Get recent activities
    public List<Map<String, Object>> getRecentActivities() {
        List<Borrow> recentBorrows = borrowRepository.findAllByOrderByRequestDateDesc()
                .stream()
                .limit(10)
                .collect(Collectors.toList());
        
        List<Map<String, Object>> activities = new ArrayList<>();
        
        for (Borrow borrow : recentBorrows) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("user", borrow.getStudent().getFullName());
            activity.put("book", borrow.getBook().getTitle());
            activity.put("time", borrow.getRequestDate().toString());
            
            // Determine action based on status
            switch (borrow.getStatus()) {
                case PENDING:
                    activity.put("action", "requested");
                    break;
                case APPROVED:
                    activity.put("action", "borrowed");
                    break;
                case RETURNED:
                    activity.put("action", "returned");
                    break;
                case REJECTED:
                    activity.put("action", "request rejected for");
                    break;
                case OVERDUE:
                    activity.put("action", "overdue with");
                    break;
                default:
                    activity.put("action", "processed");
            }
            
            activities.add(activity);
        }
        
        return activities;
    }
}

