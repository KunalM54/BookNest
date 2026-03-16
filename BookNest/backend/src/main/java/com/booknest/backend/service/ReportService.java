package com.booknest.backend.service;

import com.booknest.backend.model.Borrow;
import com.booknest.backend.model.Book;
import com.booknest.backend.model.User;
import com.booknest.backend.repository.BookRepository;
import com.booknest.backend.repository.BorrowRepository;
import com.booknest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    // Get top borrowed books
    public List<Map<String, Object>> getTopBorrowedBooks() {
        List<Object[]> results = borrowRepository.findTopBorrowedBooks();
        List<Map<String, Object>> books = new ArrayList<>();
        
        int rank = 1;
        for (Object[] result : results) {
            if (rank > 10) break;
            Map<String, Object> book = new HashMap<>();
            book.put("title", result[0]);
            book.put("count", result[1]);
            books.add(book);
            rank++;
        }
        
        return books;
    }

    // Get most active students
    public List<Map<String, Object>> getMostActiveStudents() {
        List<Object[]> results = borrowRepository.findMostActiveStudents();
        List<Map<String, Object>> students = new ArrayList<>();
        
        int rank = 1;
        for (Object[] result : results) {
            if (rank > 10) break;
            Map<String, Object> student = new HashMap<>();
            student.put("name", result[0]);
            student.put("count", result[1]);
            students.add(student);
            rank++;
        }
        
        return students;
    }

    // Get overdue books with student info
    public List<Map<String, Object>> getOverdueBooks() {
        List<Borrow> overdueBorrows = borrowRepository.findOverdueBooks();
        List<Map<String, Object>> overdueBooks = new ArrayList<>();
        
        for (Borrow borrow : overdueBorrows) {
            Map<String, Object> item = new HashMap<>();
            item.put("book", borrow.getBook().getTitle());
            item.put("student", borrow.getStudent().getFullName());
            item.put("dueDate", borrow.getDueDate() != null ? borrow.getDueDate().toString() : "N/A");
            overdueBooks.add(item);
        }
        
        return overdueBooks;
    }

    // Get least used books
    public List<Map<String, Object>> getLeastUsedBooks() {
        List<Object[]> results = borrowRepository.findLeastUsedBooks();
        List<Map<String, Object>> books = new ArrayList<>();
        
        int rank = 1;
        for (Object[] result : results) {
            if (rank > 10) break;
            Map<String, Object> book = new HashMap<>();
            book.put("title", result[0]);
            book.put("count", result[1]);
            books.add(book);
            rank++;
        }
        
        return books;
    }

    // Get analytics data for dashboard
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Total books
        analytics.put("totalBooks", bookRepository.count());
        
        // Books issued
        analytics.put("booksIssued", borrowRepository.countApprovedBorrows());
        
        // Overdue books
        analytics.put("overdueBooks", borrowRepository.countOverdueBorrows());
        
        // Returned books
        analytics.put("returnedBooks", borrowRepository.countReturnedBorrows());
        
        // Active students
        long activeStudents = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT && u.isActive())
                .count();
        analytics.put("activeStudents", activeStudents);
        
        // Total students
        analytics.put("totalStudents", userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .count());
        
        // Pending requests
        analytics.put("pendingRequests", borrowRepository.findByStatus(Borrow.BorrowStatus.PENDING).size());
        
        return analytics;
    }

    // Get inventory overview
    public Map<String, Object> getInventoryOverview() {
        Map<String, Object> overview = new HashMap<>();
        
        long totalBooks = bookRepository.count();
        long totalCopies = bookRepository.findAll().stream()
                .mapToInt(Book::getTotalCopies)
                .sum();
        long availableCopies = bookRepository.findAll().stream()
                .mapToInt(Book::getAvailableCopies)
                .sum();
        long issuedCopies = totalCopies - availableCopies;
        
        overview.put("totalBooks", totalBooks);
        overview.put("totalCopies", totalCopies);
        overview.put("availableCopies", availableCopies);
        overview.put("issuedCopies", issuedCopies);
        
        return overview;
    }

    // Get books issued trend for last 7 days
    public List<Map<String, Object>> getIssuedTrend() {
        LocalDate startDate = LocalDate.now().minusDays(6);
        List<Object[]> results = borrowRepository.findIssuedTrend(startDate);
        
        Map<LocalDate, Long> dateMap = new HashMap<>();
        for (Object[] result : results) {
            dateMap.put((LocalDate) result[0], (Long) result[1]);
        }
        
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toString());
            dayData.put("day", date.getDayOfWeek().name().substring(0, 3));
            dayData.put("count", dateMap.getOrDefault(date, 0L));
            trend.add(dayData);
        }
        
        return trend;
    }

    // Get category stats with count and percentage
    public List<Map<String, Object>> getCategoryStatsWithCount() {
        List<Object[]> groupedResults = bookRepository.countByCategoryGrouped();
        List<Map<String, Object>> categoryStats = new ArrayList<>();
        
        long totalBooks = bookRepository.count();
        
        for (Object[] result : groupedResults) {
            String category = (String) result[0];
            Long count = (Long) result[1];
            
            Map<String, Object> catStat = new HashMap<>();
            catStat.put("name", category);
            catStat.put("count", count);
            catStat.put("percentage", totalBooks > 0 ? (count * 100 / totalBooks) : 0);
            categoryStats.add(catStat);
        }
        
        categoryStats.sort((a, b) -> {
            Number bCount = (Number) b.get("count");
            Number aCount = (Number) a.get("count");
            int bVal = bCount == null ? 0 : bCount.intValue();
            int aVal = aCount == null ? 0 : aCount.intValue();
            return Integer.compare(bVal, aVal);
        });
        
        return categoryStats;
    }

    // Get recently added books
    public List<Map<String, Object>> getRecentlyAddedBooks() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Book> recentBooks = bookRepository.findRecentlyAdded(thirtyDaysAgo);
        
        List<Map<String, Object>> books = new ArrayList<>();
        int rank = 1;
        for (Book book : recentBooks) {
            if (rank > 10) break;
            Map<String, Object> bookData = new HashMap<>();
            bookData.put("title", book.getTitle());
            bookData.put("addedDate", book.getAddedDate() != null ? book.getAddedDate().toString() : "N/A");
            books.add(bookData);
            rank++;
        }
        
        return books;
    }

    // Get all activities including book added and student registered
    public List<Map<String, Object>> getAllActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // Borrow activities
        List<Borrow> recentBorrows = borrowRepository.findAllByOrderByRequestDateDesc()
                .stream()
                .limit(15)
                .collect(Collectors.toList());
        
        for (Borrow borrow : recentBorrows) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("user", borrow.getStudent().getFullName());
            activity.put("book", borrow.getBook().getTitle());
            activity.put("time", borrow.getRequestDate().toString());
            activity.put("type", "borrow");
            
            switch (borrow.getStatus()) {
                case PENDING:
                    activity.put("action", "requested");
                    activity.put("icon", "send");
                    activity.put("color", "#f59e0b");
                    break;
                case APPROVED:
                    activity.put("action", "borrowed");
                    activity.put("icon", "menu_book");
                    activity.put("color", "#3b82f6");
                    break;
                case RETURNED:
                    activity.put("action", "returned");
                    activity.put("icon", "check_circle");
                    activity.put("color", "#10b981");
                    break;
                case REJECTED:
                    activity.put("action", "request rejected");
                    activity.put("icon", "cancel");
                    activity.put("color", "#ef4444");
                    break;
                case OVERDUE:
                    activity.put("action", "overdue");
                    activity.put("icon", "warning");
                    activity.put("color", "#dc2626");
                    break;
                default:
                    activity.put("action", "processed");
                    activity.put("icon", "info");
                    activity.put("color", "#6b7280");
            }
            
            activities.add(activity);
        }
        
        // Book added activities
        List<Book> recentBooks = bookRepository.findRecentBooks().stream().limit(5).collect(Collectors.toList());
        for (Book book : recentBooks) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("user", "Admin");
            activity.put("book", book.getTitle());
            activity.put("time", book.getAddedDate() != null ? book.getAddedDate().toString() : LocalDate.now().toString());
            activity.put("action", "added new book");
            activity.put("type", "book_added");
            activity.put("icon", "add_circle");
            activity.put("color", "#8b5cf6");
            activities.add(activity);
        }
        
        // Sort by time
        activities.sort((a, b) -> {
            String timeA = (String) a.get("time");
            String timeB = (String) b.get("time");
            return timeB.compareTo(timeA);
        });
        
        return activities.stream().limit(20).collect(Collectors.toList());
    }
}

