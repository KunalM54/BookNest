import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BorrowRequest {
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

export interface DashboardStats {
  totalBooks: number;
  activeMembers: number;
  booksIssued: number;
  overdueBooks: number;
}

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private apiUrl = 'http://localhost:8080/api/borrow';

  constructor(private http: HttpClient) { }

  // Get all borrow requests
  getAllRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/requests`);
  }

  // Get pending requests
  getPendingRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/pending`);
  }

  // Get requests by status
  getRequestsByStatus(status: string): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/status/${status}`);
  }

  // Create new borrow request
  createRequest(studentId: number, bookId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request`, {}, {
      params: { studentId: studentId.toString(), bookId: bookId.toString() }
    });
  }

  // Approve borrow request
  approveRequest(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/approve/${id}`, {});
  }

  // Reject borrow request
  rejectRequest(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reject/${id}`, {});
  }

  // Return book
  returnBook(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/return/${id}`, {});
  }

  // Remove borrow request
  removeRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove/${id}`);
  }

  // Get dashboard statistics
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  // Get recent requests for dashboard
  getRecentRequests(limit: number = 5): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/recent?limit=${limit}`);
  }

  // Student specific methods
  getMyBooks(userId: number): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/my-books`, {
      params: { userId: userId.toString() }
    });
  }

  getHistory(userId: number): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/history`, {
      params: { userId: userId.toString() }
    });
  }

  getMyRequests(userId: number): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/my-requests`, {
      params: { userId: userId.toString() }
    });
  }
}

