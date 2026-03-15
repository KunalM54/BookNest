import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import type { BorrowRequest } from '../../../services/borrow';

@Component({
  selector: 'app-borrow-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrow-requests.html',
  styleUrls: ['./borrow-requests.css']
})
export class BorrowRequestsComponent implements OnInit {

  requests: BorrowRequest[] = [];

  private apiUrl = 'http://localhost:8080/api/borrow';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.http.get<BorrowRequest[]>(`${this.apiUrl}/requests`).subscribe({
      next: (data: BorrowRequest[]) => {
        this.requests = (data || []).map((item) => ({
          ...item,
          borrowDate: item.requestDate,
          displayStatus: item.status === 'APPROVED' ? 'ISSUED' : item.status === 'RETURNED' ? 'RETURNED' : (item.status || 'PENDING').toUpperCase()
        })).sort((a, b) => {
          const aStatus = a.displayStatus;
          const bStatus = b.displayStatus;
          if (aStatus === 'PENDING' && bStatus !== 'PENDING') return -1;
          if (aStatus !== 'PENDING' && bStatus === 'PENDING') return 1;
          const aTime = a.requestDate ? new Date(a.requestDate).getTime() : 0;
          const bTime = b.requestDate ? new Date(b.requestDate).getTime() : 0;
          return bTime - aTime;
        });

      },
      error: (error: any) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  approve(id: number) {
    this.http.put<any>(`${this.apiUrl}/approve/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadRequests();
        }
      },
      error: (error: any) => {
        console.error('Error approving request:', error);
      }
    });
  }

  reject(id: number) {
    this.http.put<any>(`${this.apiUrl}/reject/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadRequests();
        }
      },
      error: (error: any) => {
        console.error('Error rejecting request:', error);
      }
    });
  }

  markReturned(id: number) {
    this.http.put<any>(`${this.apiUrl}/return/${id}`, {}).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadRequests();
        }
      },
      error: (error: any) => {
        console.error('Error marking as returned:', error);
      }
    });
  }

  remove(id: number) {
    this.http.delete<any>(`${this.apiUrl}/remove/${id}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadRequests();
        }
      },
      error: (error: any) => {
        console.error('Error removing request:', error);
      }
    });
  }
}



