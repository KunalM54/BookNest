import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        this.requests = data;
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

