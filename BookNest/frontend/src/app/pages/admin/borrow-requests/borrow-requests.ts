import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BorrowRequest } from '../../../services/borrow';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';

@Component({
  selector: 'app-borrow-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalSearchBarComponent],
  templateUrl: './borrow-requests.html',
  styleUrls: ['./borrow-requests.css']
})
export class BorrowRequestsComponent implements OnInit {

  requests: BorrowRequest[] = [];
  filteredRequests: BorrowRequest[] = [];
  paginatedRequests: BorrowRequest[] = [];
  activeTab: string = 'all';
  searchTerm = '';
  sortBy = 'newest';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  private apiUrl = 'http://localhost:8080/api/borrow';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadRequests();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
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

    // Filter by tab
    if (this.activeTab !== 'all') {
      data = data.filter(req => {
        const status = req.displayStatus?.toUpperCase();
        switch (this.activeTab) {
          case 'pending': return status === 'PENDING';
          // FIX: Issued tab shows both APPROVED and OVERDUE books
          case 'issued': return status === 'APPROVED' || status === 'OVERDUE';
          case 'returned': return status === 'RETURNED' || status === 'RETURNED_ON_TIME' || status === 'RETURNED_LATE';
          case 'rejected': return status === 'REJECTED';
          default: return true;
        }
      });
    }

    // Filter by search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(req =>
        (req.bookTitle || '').toLowerCase().includes(term) ||
        (req.studentName || '').toLowerCase().includes(term)
      );
    }

    // Sort
    data = this.sortRequests(data);

    this.filteredRequests = data;
    this.updatePagination();
  }

  sortRequests(data: BorrowRequest[]): BorrowRequest[] {
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
    return this.filteredRequests.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredRequests.length);
  }

  get filteredRequestsForDisplay() {
    return this.paginatedRequests;
  }

  // Pending count
  get pendingCount(): number {
    return this.requests.filter(r => r.displayStatus === 'PENDING').length;
  }

  // FIX: Issued count includes both APPROVED and OVERDUE (overdue books are still issued)
  get issuedCount(): number {
    return this.requests.filter(r =>
      r.displayStatus === 'APPROVED' || r.displayStatus === 'OVERDUE'
    ).length;
  }

  // Returned count covers both on-time and late returns
  get returnedCount(): number {
    return this.requests.filter(r =>
      r.displayStatus === 'RETURNED' ||
      r.displayStatus === 'RETURNED_ON_TIME' ||
      r.displayStatus === 'RETURNED_LATE'
    ).length;
  }

  // FIX: Overdue count reads displayStatus === 'OVERDUE' directly (set by backend)
  get overdueCount(): number {
    return this.requests.filter(r => r.displayStatus === 'OVERDUE').length;
  }

  // FIX: Status class uses displayStatus directly — no more manual date comparison
  getStatusClass(req: BorrowRequest): string {
    const status = (req.displayStatus || req.status || 'PENDING').toUpperCase();
    switch (status) {
      case 'APPROVED': return 'issued';
      case 'OVERDUE': return 'overdue';
      case 'PENDING': return 'pending';
      case 'REJECTED': return 'rejected';
      case 'RETURNED':
      case 'RETURNED_ON_TIME': return 'returned';
      case 'RETURNED_LATE': return 'returned-late';
      default: return 'pending';
    }
  }

  // FIX: Status label uses displayStatus directly
  getStatusText(req: BorrowRequest): string {
    const status = (req.displayStatus || req.status || 'PENDING').toUpperCase();
    switch (status) {
      case 'APPROVED': return 'Issued';
      case 'OVERDUE': return 'Overdue';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Rejected';
      case 'RETURNED_ON_TIME': return 'Returned On Time';
      case 'RETURNED_LATE': return 'Returned Late';
      case 'RETURNED': return 'Returned';
      default: return status;
    }
  }

  isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  getTabCount(tab: string): number {
    const data = this.requests;
    if (tab === 'all') return data.length;
    return data.filter(req => {
      const status = req.displayStatus?.toUpperCase();
      switch (tab) {
        case 'pending': return status === 'PENDING';
        // FIX: Tab count for issued includes OVERDUE
        case 'issued': return status === 'APPROVED' || status === 'OVERDUE';
        case 'returned': return status === 'RETURNED' || status === 'RETURNED_ON_TIME' || status === 'RETURNED_LATE';
        case 'rejected': return status === 'REJECTED';
        default: return true;
      }
    }).length;
  }

  loadRequests() {
    this.http.get<BorrowRequest[]>(`${this.apiUrl}/requests`).subscribe({
      next: (data: BorrowRequest[]) => {
        this.requests = (data || []).map((item) => ({
          ...item,
          borrowDate: item.actionDate || item.requestDate,
          // FIX: Backend now sends correct displayStatus — just use it directly
          displayStatus: item.status || 'PENDING'
        })).sort((a, b) => {
          const aStatus = a.displayStatus;
          const bStatus = b.displayStatus;
          if (aStatus === 'PENDING' && bStatus !== 'PENDING') return -1;
          if (aStatus !== 'PENDING' && bStatus === 'PENDING') return 1;
          const aTime = a.requestDate ? new Date(a.requestDate).getTime() : 0;
          const bTime = b.requestDate ? new Date(b.requestDate).getTime() : 0;
          return bTime - aTime;
        });
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  approve(id: number) {
    this.http.put<any>(`${this.apiUrl}/approve/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) { this.loadRequests(); }
      },
      error: (error: any) => { console.error('Error approving request:', error); }
    });
  }

  reject(id: number) {
    this.http.put<any>(`${this.apiUrl}/reject/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) { this.loadRequests(); }
      },
      error: (error: any) => { console.error('Error rejecting request:', error); }
    });
  }

  markReturned(id: number) {
    this.http.put<any>(`${this.apiUrl}/return/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) { this.loadRequests(); }
      },
      error: (error: any) => { console.error('Error marking as returned:', error); }
    });
  }

  remove(id: number) {
    this.http.delete<any>(`${this.apiUrl}/remove/${id}`).subscribe({
      next: (response: any) => {
        if (response.success) { this.loadRequests(); }
      },
      error: (error: any) => { console.error('Error removing request:', error); }
    });
  }
}