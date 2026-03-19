import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BorrowService, BorrowRequest } from '../../../services/borrow';
import { BookService } from '../../../services/book';
import { SnackbarService } from '../../../services/snackbar';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';

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
    private bookService: BookService,
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
        next: async (data: any[]) => {
          const books = data || [];
          for (const book of books) {
            let imageData: string | null = null;
            try {
              const bookDetails = await this.bookService.getBookById(book.bookId).toPromise();
              imageData = bookDetails?.imageData || null;
            } catch {
              imageData = null;
            }
            
            this.borrowedBooks.push({
              id: book.id,
              bookId: book.bookId,
              bookTitle: book.bookTitle || book.title || 'Unknown',
              bookAuthor: book.bookAuthor || book.author || 'Unknown',
              imageData: imageData,
              borrowDate: book.requestDate || book.borrowDate || '-',
              dueDate: book.dueDate || null,
              status: (book.status || 'ISSUED').toUpperCase(),
              isOverdue: book.dueDate && new Date(book.dueDate) < new Date()
            });
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadHistory(userId: number): Promise<void> {
    return new Promise((resolve) => {
      this.borrowService.getHistory(userId).subscribe({
        next: async (data: any[]) => {
          const records = (data || []).filter((record: any) => record.status === 'RETURNED');
          for (const record of records) {
            let imageData: string | null = null;
            try {
              const bookDetails = await this.bookService.getBookById(record.bookId).toPromise();
              imageData = bookDetails?.imageData || null;
            } catch {
              imageData = null;
            }
            
            this.history.push({
              id: record.id,
              bookId: record.bookId,
              bookTitle: record.bookTitle || record.title || 'Unknown',
              bookAuthor: record.bookAuthor || record.author || 'Unknown',
              imageData: imageData,
              borrowDate: record.requestDate || record.borrowDate || null,
              returnDate: record.returnDate || null,
              status: 'RETURNED'
            });
          }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToPreviousPage() { this.goToPage(this.currentPage - 1); }
  goToNextPage() { this.goToPage(this.currentPage + 1); }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
