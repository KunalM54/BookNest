import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  templateUrl: './dashboard.html',
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

  constructor(private http: HttpClient) { }

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
    this.http.get<BorrowRequest[]>(`${this.apiUrl}/recent?limit=5`).subscribe({
      next: (data: BorrowRequest[]) => {
        this.requests = data;
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

  get pendingRequests() {
    return this.requests.filter(r => r.status === 'PENDING').length;
  }
}

