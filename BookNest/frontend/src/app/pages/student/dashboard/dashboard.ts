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

        const overdueCount = (myBooks || []).filter((book: BorrowRequest) => {
          return book.status === 'OVERDUE' || (!!book.dueDate && new Date(book.dueDate) < new Date());
        }).length;

        const pendingCount = (myRequests || []).length;

        const totalRead = (myHistory || []).filter((record: BorrowRequest) => {
          return record.status === 'RETURNED';
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
    return this.currentBooks.filter(book => book.status === 'Overdue').length;
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
