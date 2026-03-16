import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { BorrowService } from '../../../services/borrow';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        this.history = (data || []).filter(record => record.status === 'RETURNED').map((record: any) => ({
          id: record.id,
          title: record.bookTitle || record.title || 'Unknown',
          borrowDate: record.requestDate || record.borrowDate || null,
          returnDate: record.returnDate || null,
          status: 'RETURNED'
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
  }

  goToPreviousPage() { this.goToPage(this.currentPage - 1); }
  goToNextPage() { this.goToPage(this.currentPage + 1); }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginationStart(): number {
    return this.filteredHistory.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredHistory.length);
  }
}
