import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BorrowService, BorrowRequest } from '../../../services/borrow';
import { SnackbarService } from '../../../services/snackbar';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';
import { scrollToTop } from '../../../utils/scroll-to-top';

@Component({
  selector: 'app-my-activity',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GlobalSearchBarComponent],
  templateUrl: './my-activity.html',
  styleUrls: ['./my-activity.css']
})
export class MyActivityComponent implements OnInit {

  activeTab: 'requests' | 'borrowed' | 'history' = 'requests';
  
  requests: any[] = [];
  borrowedBooks: any[] = [];
  history: any[] = [];
  
  filteredItems: any[] = [];
  paginatedItems: any[] = [];
  
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private borrowService: BorrowService,
    private authService: AuthService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Please login to view your activity';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.requests = [];
    this.borrowedBooks = [];
    this.history = [];

    Promise.all([
      this.loadRequests(userId),
      this.loadBorrowedBooks(userId),
      this.loadHistory(userId)
    ]).finally(() => {
      this.isLoading = false;
      this.applyFilters();
    });
  }

  loadRequests(userId: number): Promise<void> {
    return new Promise((resolve) => {
      this.borrowService.getMyRequestsHistory(userId).subscribe({
        next: (data: BorrowRequest[]) => {
          this.requests = (data || [])
            .filter((req: BorrowRequest) => req.status === 'PENDING' || req.status === 'REJECTED')
            .map((req: BorrowRequest) => ({
              id: req.id,
              bookId: req.bookId,
              bookTitle: req.bookTitle || 'Unknown',
              bookAuthor: req.bookAuthor || '',
              requestDate: req.requestDate || '-',
              status: (req.status || 'PENDING').toUpperCase()
            }));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadBorrowedBooks(userId: number): Promise<void> {
    return new Promise((resolve) => {
      this.borrowService.getMyBooks(userId).subscribe({
        next: (data: any[]) => {
          this.borrowedBooks = (data || []).map(book => ({
            id: book.id,
            bookId: book.bookId,
            bookTitle: book.bookTitle || book.title || 'Unknown',
            bookAuthor: book.bookAuthor || book.author || 'Unknown',
            imageData: book.bookImage || null,
            borrowDate: book.requestDate || book.borrowDate || '-',
            dueDate: book.dueDate || null,
            status: (book.status || 'APPROVED').toUpperCase(),
            isOverdue: book.status === 'OVERDUE' || (book.dueDate && new Date(book.dueDate) < new Date())
          }));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadHistory(userId: number): Promise<void> {
    return new Promise((resolve) => {
      this.borrowService.getHistory(userId).subscribe({
        next: (data: any[]) => {
          const returnedStatuses = ['RETURNED', 'RETURNED_ON_TIME', 'RETURNED_LATE'];
          this.history = (data || [])
            .filter((record: any) => returnedStatuses.includes(record.status))
            .map(record => ({
              id: record.id,
              bookId: record.bookId,
              bookTitle: record.bookTitle || record.title || 'Unknown',
              bookAuthor: record.bookAuthor || record.author || 'Unknown',
              imageData: record.bookImage || null,
              borrowDate: record.requestDate || record.borrowDate || null,
              returnDate: record.returnDate || null,
              status: record.status || 'RETURNED'
            }));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  setTab(tab: 'requests' | 'borrowed' | 'history') {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let data: any[] = [];
    
    switch (this.activeTab) {
      case 'requests':
        data = [...this.requests];
        break;
      case 'borrowed':
        data = [...this.borrowedBooks];
        break;
      case 'history':
        data = [...this.history];
        break;
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(item =>
        (item.bookTitle || '').toLowerCase().includes(term) ||
        (item.bookAuthor || '').toLowerCase().includes(term)
      );
    }

    this.filteredItems = data;
    this.updatePagination();
  }

  updatePagination() {
    const total = this.filteredItems.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedItems = this.filteredItems.slice(startIndex, startIndex + this.pageSize);
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

  cancelRequest(id: number, bookTitle: string) {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    this.borrowService.removeRequest(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackbar.show('Request cancelled successfully');
          this.requests = this.requests.filter(r => r.id !== id);
          this.applyFilters();
        }
      },
      error: () => {
        this.snackbar.show('Failed to cancel request');
      }
    });
  }

  getBookInitial(item: any): string {
    return (item.bookTitle || 'B').charAt(0).toUpperCase();
  }

  getItemCount(tab: 'requests' | 'borrowed' | 'history'): number {
    switch (tab) {
      case 'requests': return this.requests.length;
      case 'borrowed': return this.borrowedBooks.length;
      case 'history': return this.history.length;
    }
  }

  getStatusIcon(item: any): string {
    if (item.isOverdue) return 'error';
    switch (item.status) {
      case 'PENDING': return 'schedule';
      case 'ISSUED':
      case 'BORROWED': return 'menu_book';
      case 'RETURNED': return 'check_circle';
      case 'REJECTED': return 'cancel';
      default: return 'info';
    }
  }

  getEmptyIcon(): string {
    switch (this.activeTab) {
      case 'requests': return 'pending_actions';
      case 'borrowed': return 'library_books';
      case 'history': return 'history';
      default: return 'menu_book';
    }
  }

  getEmptyTitle(): string {
    switch (this.activeTab) {
      case 'requests': return 'No requests yet';
      case 'borrowed': return 'No borrowed books';
      case 'history': return 'No history yet';
      default: return 'Nothing here';
    }
  }

  getEmptyMessage(): string {
    switch (this.activeTab) {
      case 'requests': return 'You haven\'t made any book requests yet';
      case 'borrowed': return 'You don\'t have any books borrowed';
      case 'history': return 'Your returned books will appear here';
      default: return '';
    }
  }
}
