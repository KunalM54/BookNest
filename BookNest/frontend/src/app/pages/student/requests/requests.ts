
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { BorrowRequest, BorrowService } from '../../../services/borrow';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.html',
  styleUrls: ['./requests.css']
})
export class RequestsComponent implements OnInit {

  requests: any[] = [];
  filteredRequests: any[] = [];
  paginatedRequests: any[] = [];
  isLoading = false;
  searchTerm = '';
  sortBy = 'newest';
  
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private borrowService: BorrowService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    const userId = this.authService.getUserId();
    this.borrowService.getMyRequestsHistory(userId || 0).subscribe({
      next: (data: BorrowRequest[]) => {
        this.requests = (data || []).map((req: BorrowRequest) => ({
          id: req.id,
          bookTitle: req.bookTitle || 'Unknown',
          requestDate: req.requestDate || '-',
          status: (req.status || 'PENDING').toUpperCase(),
          actionDate: req.actionDate || '-'
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading requests', err);
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
    let data = [...this.requests];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(req =>
        req.bookTitle.toLowerCase().includes(term)
      );
    }

    data = this.sortRequests(data);
    this.filteredRequests = data;
    this.updatePagination();
  }

  sortRequests(data: any[]): any[] {
    return data.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
        case 'oldest':
          return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
        case 'titleAZ':
          return (a.bookTitle || '').localeCompare(b.bookTitle || '');
        default:
          return 0;
      }
    });
  }

  updatePagination() {
    const total = this.filteredRequests.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedRequests = this.filteredRequests.slice(startIndex, startIndex + this.pageSize);
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
    return this.filteredRequests.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredRequests.length);
  }
}
