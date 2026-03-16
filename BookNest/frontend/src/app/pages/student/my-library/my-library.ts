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
          imageData: this.formatImageData(book.bookImage),
          isOverdue: book.dueDate && new Date(book.dueDate) < new Date()
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
        this.history = (data || [])
          .filter((record: any) => record.status === 'RETURNED')
          .map((record: any) => ({
            id: record.id,
            title: record.bookTitle || record.title || 'Unknown',
            borrowDate: record.requestDate || record.borrowDate || null,
            returnDate: record.returnDate || null
          }));
        this.loadingHistory = false;
      },
      error: () => {
        this.loadingHistory = false;
      }
    });
  }

  formatImageData(imageData: string | null | undefined): string | null {
    if (!imageData) return null;
    
    const trimmed = imageData.trim();
    if (!trimmed) return null;
    
    // If it already has data: prefix, return as-is
    if (trimmed.startsWith('data:')) {
      return trimmed;
    }
    
    // Try to detect image type
    try {
      const decoded = atob(trimmed.substring(0, 16));
      if (decoded.startsWith('\x89PNG')) {
        return `data:image/png;base64,${trimmed}`;
      }
      if (decoded.startsWith('\xFF\xD8')) {
        return `data:image/jpeg;base64,${trimmed}`;
      }
    } catch (e) {
      // Fall through
    }
    
    // Default to JPEG
    return `data:image/jpeg;base64,${trimmed}`;
  }

  get pendingCount(): number {
    return this.requests.filter(r => r.status === 'PENDING').length;
  }
}
