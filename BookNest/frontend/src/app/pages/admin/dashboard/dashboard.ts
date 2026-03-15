import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface BorrowRequest {
  id: number;
  studentId: number;
  studentName: string;
  studentIdNumber: string;
  studentEmail: string;
  bookId: number;
  bookTitle: string;
  bookIsbn: string;
  requestDate: string;
  dueDate: string | null;
  returnDate: string | null;
  status: string;
}

interface DashboardStats {
  totalBooks: number;
  activeMembers: number;
  booksIssued: number;
  overdueBooks: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-updated.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  stats: DashboardStats = {
    totalBooks: 0,
    activeMembers: 0,
    booksIssued: 0,
    overdueBooks: 0
  };

  requests: BorrowRequest[] = [];

  private apiUrl = 'http://localhost:8080/api/borrow';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadStats();
    this.loadRecentRequests();
  }

  loadStats() {
    this.http.get<DashboardStats>(`${this.apiUrl}/stats`).subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
      },
      error: (error: any) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  loadRecentRequests() {
    this.http.get<BorrowRequest[]>(`${this.apiUrl}/recent?limit=20`).subscribe({
      next: (data: BorrowRequest[]) => {
        this.requests = [...data]
          .sort((a, b) => this.compareRequests(b, a))
          .slice(0, 5);
      },
      error: (error: any) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  approveRequest(id: number) {
    this.http.put<any>(`${this.apiUrl}/approve/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadRecentRequests();
        }
      },
      error: (error: any) => {
        console.error('Error approving request:', error);
      }
    });
  }

  rejectRequest(id: number) {
    this.http.put<any>(`${this.apiUrl}/reject/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadRecentRequests();
        }
      },
      error: (error: any) => {
        console.error('Error rejecting request:', error);
      }
    });
  }

  removeRequest(id: number) {
    this.http.delete<any>(`${this.apiUrl}/remove/${id}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadRecentRequests();
        }
      },
      error: (error: any) => {
        console.error('Error removing request:', error);
      }
    });
  }

  navigateToManageBooks() {
    this.router.navigate(['/admin/books']);
  }

  private compareRequests(a: BorrowRequest, b: BorrowRequest): number {
    const dateA = this.parseRequestDate(a.requestDate);
    const dateB = this.parseRequestDate(b.requestDate);

    if (dateA !== null && dateB !== null) {
      return dateB - dateA;
    }

    if (dateA !== null) return 1;
    if (dateB !== null) return -1;

    return a.id - b.id;
  }

  private parseRequestDate(dateStr: string): number | null {
    if (!dateStr) return null;

    const direct = new Date(dateStr).getTime();
    if (!isNaN(direct)) return direct;

    const match = dateStr.match(
      /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:[ ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
    );

    if (match) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const hour = Number(match[4] ?? 0);
      const minute = Number(match[5] ?? 0);
      const second = Number(match[6] ?? 0);

      return new Date(year, month, day, hour, minute, second).getTime();
    }

    return null;
  }

  get pendingRequests() {
    return this.requests.filter(r => r.status === 'PENDING').length;
  }
}