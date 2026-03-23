import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { BorrowService } from '../../../services/borrow';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';
import { scrollToTop } from '../../../utils/scroll-to-top';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalSearchBarComponent],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {

  history: any[] = [];
  filteredHistory: any[] = [];
  paginatedHistory: any[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  sortBy = 'newest';
  
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private borrowService: BorrowService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Please login to view your history';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.borrowService.getHistory(userId).subscribe({
      next: (data) => {
        // Include RETURNED, RETURNED_ON_TIME, RETURNED_LATE statuses from backend
        const returnedStatuses = ['RETURNED', 'RETURNED_ON_TIME', 'RETURNED_LATE'];
        this.history = (data || []).filter(record => returnedStatuses.includes(record.status)).map((record: any) => ({
          id: record.id,
          bookId: record.bookId,
          title: record.bookTitle || record.title || 'Unknown',
          author: record.bookAuthor || record.author || 'Unknown',
          bookImage: record.bookImage || null,
          borrowDate: record.requestDate || record.borrowDate || null,
          returnDate: record.returnDate || null,
          status: record.status || 'RETURNED'
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading history', err);
        this.errorMessage = 'Failed to load history. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    if (!this.searchTerm) {
      this.filteredHistory = this.history;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredHistory = this.history.filter(record =>
        record.title.toLowerCase().includes(term)
      );
    }
    
    // Sort
    this.filteredHistory = this.filteredHistory.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.returnDate || 0).getTime() - new Date(a.returnDate || 0).getTime();
        case 'oldest':
          return new Date(a.returnDate || 0).getTime() - new Date(b.returnDate || 0).getTime();
        case 'titleAZ':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
    
    this.updatePagination();
  }

  updatePagination() {
    const total = this.filteredHistory.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedHistory = this.filteredHistory.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.updatePagination();
    scrollToTop();
  }

  goToPreviousPage() { this.goToPage(this.currentPage - 1); }
  goToNextPage() { this.goToPage(this.currentPage + 1); }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1, total);
    } else if (current >= total - 3) {
      pages.push(1, -1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1, -1, current - 1, current, current + 1, -2, total);
    }
    return pages;
  }

  get paginationStart(): number {
    return this.filteredHistory.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredHistory.length);
  }
}
