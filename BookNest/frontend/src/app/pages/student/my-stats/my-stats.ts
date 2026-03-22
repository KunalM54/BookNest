import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BorrowService } from '../../../services/borrow';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-stats.html',
  styleUrls: ['./my-stats.css']
})
export class MyStatsComponent implements OnInit {

  isLoading = false;

  // Summary counts
  totalBorrowed = 0;
  totalReturned = 0;
  currentlyBorrowing = 0;
  overdueCount = 0;
  onTimeReturns = 0;
  lateReturns = 0;

  // Tables
  borrowHistory: any[] = [];
  topCategories: any[] = [];
  mostBorrowedBooks: any[] = [];

  constructor(
    private authService: AuthService,
    private borrowService: BorrowService
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isLoading = true;

    forkJoin({
      myBooks: this.borrowService.getMyBooks(userId),
      history: this.borrowService.getHistory(userId),
      requests: this.borrowService.getMyRequests(userId)
    }).subscribe({
      next: ({ myBooks, history, requests }) => {
        const returned = (history || []).filter(r =>
          ['RETURNED','RETURNED_ON_TIME','RETURNED_LATE'].includes(r.status)
        );

        this.currentlyBorrowing = (myBooks || []).length;
        this.overdueCount = (myBooks || []).filter(b =>
          b.status === 'OVERDUE' || (b.dueDate && new Date(b.dueDate) < new Date())
        ).length;
        this.totalReturned = returned.length;
        this.onTimeReturns = returned.filter(r => r.status === 'RETURNED' || r.status === 'RETURNED_ON_TIME').length;
        this.lateReturns = returned.filter(r => r.status === 'RETURNED_LATE').length;
        this.totalBorrowed = this.currentlyBorrowing + this.totalReturned;

        // Build full history table
        const activeRows = (myBooks || []).map(b => ({
          title: b.bookTitle || 'Unknown',
          author: b.bookAuthor || 'Unknown',
          bookImage: b.bookImage || null,
          borrowDate: b.requestDate || null,
          returnDate: null,
          dueDate: b.dueDate || null,
          status: b.status === 'OVERDUE' || (b.dueDate && new Date(b.dueDate) < new Date())
            ? 'OVERDUE' : 'ACTIVE'
        }));

        const historyRows = returned.map(b => ({
          title: b.bookTitle || 'Unknown',
          author: b.bookAuthor || 'Unknown',
          bookImage: b.bookImage || null,
          borrowDate: b.requestDate || null,
          returnDate: b.returnDate || null,
          dueDate: b.dueDate || null,
          status: b.status === 'RETURNED_LATE' ? 'LATE' : 'ON_TIME'
        }));

        this.borrowHistory = [...activeRows, ...historyRows];

        // Most borrowed books (by title frequency)
        const bookCount: Record<string, { title: string; author: string; bookImage: string | null; count: number }> = {};
        [...activeRows, ...historyRows].forEach(r => {
          const key = r.title;
          if (!bookCount[key]) {
            bookCount[key] = { title: r.title, author: r.author, bookImage: r.bookImage, count: 0 };
          }
          bookCount[key].count++;
        });
        this.mostBorrowedBooks = Object.values(bookCount)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  get onTimeRate(): number {
    if (!this.totalReturned) return 0;
    return Math.round((this.onTimeReturns / this.totalReturned) * 100);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'active';
      case 'OVERDUE': return 'overdue';
      case 'ON_TIME': return 'ontime';
      case 'LATE': return 'late';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'OVERDUE': return 'Overdue';
      case 'ON_TIME': return 'Returned On Time';
      case 'LATE': return 'Returned Late';
      default: return status;
    }
  }

  exportCSV() {
    const rows: any[][] = [
      ['MY LIBRARY STATS — BookNest'],
      [`Student: ${this.authService.getUser()?.fullName || ''}`],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [],
      ['SUMMARY'],
      ['Total Books Borrowed', this.totalBorrowed],
      ['Currently Borrowing', this.currentlyBorrowing],
      ['Total Returned', this.totalReturned],
      ['Overdue Books', this.overdueCount],
      ['On-Time Return Rate', `${this.onTimeRate}%`],
      [],
      ['BORROW HISTORY'],
      ['Title', 'Author', 'Borrow Date', 'Return Date', 'Status'],
      ...this.borrowHistory.map(r => [
        r.title, r.author,
        r.borrowDate || '-',
        r.returnDate || '-',
        this.getStatusLabel(r.status)
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my-library-stats.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
