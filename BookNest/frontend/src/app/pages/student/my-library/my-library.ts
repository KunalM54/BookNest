import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { BorrowService } from '../../../services/borrow';

@Component({
  selector: 'app-my-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-library.html',
  styleUrls: ['./my-library.css']
})
export class MyLibraryComponent implements OnInit {
  activeTab = 'mybooks';
  
  // My Books
  borrowedBooks: any[] = [];
  loading = false;
  
  // Requests
  requests: any[] = [];
  loadingRequests = false;
  
  // History
  history: any[] = [];
  loadingHistory = false;

  constructor(
    private authService: AuthService,
    private borrowService: BorrowService
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadMyBooks();
    this.loadRequests();
    this.loadHistory();
  }

  loadMyBooks() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    this.borrowService.getMyBooks(userId).subscribe({
      next: (books) => {
        this.borrowedBooks = books.map((book: any) => ({
          id: book.id,
          title: book.bookTitle || book.title,
          author: book.bookAuthor || book.author || 'Unknown',
          borrowDate: book.requestDate,
          dueDate: book.dueDate,
          imageData: book.bookImage || null,
          status: book.status,
          isOverdue: book.status === 'OVERDUE' || (book.dueDate && new Date(book.dueDate) < new Date())
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadRequests() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loadingRequests = true;
    this.borrowService.getMyRequestsHistory(userId).subscribe({
      next: (data) => {
        this.requests = (data || []).map((req: any) => ({
          id: req.id,
          bookTitle: req.bookTitle || 'Unknown',
          bookImage: req.bookImage || null,
          requestDate: req.requestDate || '-',
          status: (req.status || 'PENDING').toUpperCase(),
          actionDate: req.actionDate || '-'
        }));
        this.loadingRequests = false;
      },
      error: () => {
        this.loadingRequests = false;
      }
    });
  }

  loadHistory() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loadingHistory = true;
    this.borrowService.getHistory(userId).subscribe({
      next: (data) => {
        const returnedStatuses = ['RETURNED', 'RETURNED_ON_TIME', 'RETURNED_LATE'];
        this.history = (data || [])
          .filter((record: any) => returnedStatuses.includes(record.status))
          .map((record: any) => ({
            id: record.id,
            title: record.bookTitle || record.title || 'Unknown',
            author: record.bookAuthor || record.author || 'Unknown',
            imageData: record.bookImage || null,
            borrowDate: record.requestDate || record.borrowDate || null,
            returnDate: record.returnDate || null,
            status: record.status || 'RETURNED'
          }));
        this.loadingHistory = false;
      },
      error: () => {
        this.loadingHistory = false;
      }
    });
  }

  get pendingCount(): number {
    return this.requests.filter(r => r.status === 'PENDING').length;
  }
}
