import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BorrowRequest, BorrowService } from '../../../services/borrow';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  studentName = 'Student';
  stats: { title: string; value: string; icon: string; color: string; }[] = [];
  currentBooks: { title: string; author: string; due: string; status: string; image: string; }[] = [];

  constructor(
    private authService: AuthService,
    private borrowService: BorrowService
  ) {}

  ngOnInit(): void {
    this.studentName = this.authService.getUser()?.fullName || 'Student';
    this.loadDashboardData();
  }

  loadDashboardData() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.stats = [];
      this.currentBooks = [];
      return;
    }

    forkJoin({
      myBooks: this.borrowService.getMyBooks(userId),
      myRequests: this.borrowService.getMyRequests(userId),
      myHistory: this.borrowService.getHistory(userId)
    }).subscribe({
      next: ({ myBooks, myRequests, myHistory }) => {
        const books = (myBooks || []).map((book: BorrowRequest) => ({
          title: book.bookTitle || 'Unknown',
          author: book.bookAuthor || 'Unknown',
          due: book.dueDate || '-',
          status: this.getBookStatus(book.displayStatus || book.status),
          image: book.bookImage || ''
        }));

        this.currentBooks = books;

        // Count overdue books (status is OVERDUE or due date has passed)
        const overdueCount = (myBooks || []).filter((book: BorrowRequest) => {
          const displayStatus = book.displayStatus || book.status;
          const isOverdueStatus = displayStatus === 'OVERDUE';
          const isPastDue = !!book.dueDate && new Date(book.dueDate) < new Date();
          return isOverdueStatus || (isPastDue && (displayStatus === 'APPROVED' || displayStatus === 'OVERDUE'));
        }).length;

        // Pending requests count
        const pendingCount = (myRequests || []).length;

        // Total books read (RETURNED_ON_TIME or RETURNED_LATE)
        const totalRead = (myHistory || []).filter((record: BorrowRequest) => {
          const status = record.displayStatus || record.status;
          return status === 'RETURNED_ON_TIME' || status === 'RETURNED_LATE';
        }).length;

        this.stats = [
          { title: 'Books Borrowed', value: books.length.toString(), icon: 'menu_book', color: 'blue' },
          { title: 'Return Due', value: overdueCount.toString(), icon: 'event_busy', color: 'red' },
          { title: 'Pending Requests', value: pendingCount.toString(), icon: 'hourglass_empty', color: 'orange' },
          { title: 'Total Read', value: totalRead.toString(), icon: 'check_circle', color: 'green' }
        ];
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.stats = [];
        this.currentBooks = [];
      }
    });
  }

  get dueSoonCount() {
    return this.currentBooks.filter(book => book.status === 'Overdue' || book.status === 'OVERDUE').length;
  }

  getBookStatus(displayStatus: string) {
    switch (displayStatus) {
      case 'OVERDUE':
        return 'Overdue';
      case 'APPROVED':
      case 'BORROWED':
        return 'Safe';
      case 'PENDING':
        return 'Pending';
      case 'RETURNED_ON_TIME':
      case 'RETURNED_LATE':
      case 'RETURNED':
        return 'Returned';
      default:
        return 'Safe';
    }
  }
}
