// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../../../services/auth';
// import { BorrowService } from '../../../services/borrow';

// @Component({
//   selector: 'app-student-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class DashboardComponent implements OnInit {

//   studentName = 'Student';
//   stats: { title: string; value: string; icon: string; color: string; }[] = [];
//   currentBooks: { title: string; author: string; due: string; status: string; }[] = [];


//   constructor(
//     private authService: AuthService,
//     private borrowService: BorrowService,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.studentName = this.authService.getUser()?.fullName || 'Student';
//     this.loadDashboardData();
//   }

//   loadDashboardData() {
//     this.borrowService.getStats().subscribe({
//       next: (data: any) => {
//         this.stats = [
//           { title: 'Books Borrowed', value: data.booksIssued?.toString() || '0', icon: 'menu_book', color: 'blue' },
//           { title: 'Return Due', value: data.overdueBooks?.toString() || '0', icon: 'event_busy', color: 'red' },
//           { title: 'Pending Requests', value: '0', icon: 'hourglass_empty', color: 'orange' },
//           { title: 'Total Read', value: '14', icon: 'check_circle', color: 'green' }
//         ];
//       }
//     this.http.get<any[]>('http://localhost:8080/api/borrow/current').subscribe({
//       next: (books: any[]) => {
//         this.currentBooks = books.map((book: any) => ({
//           title: book.bookTitle,
//           author: book.author || 'Unknown',
//           due: book.dueDate || '',
//           status: this.getBookStatus(book.dueDate || '')
//         }));
//       }
//     });
//   }
//   }

//   get dueSoonCount() {
//     return this.currentBooks.filter(book => book.status === 'Due Soon').length;
//   }

//   getBookStatus(dueDate: string) {
//     if (!dueDate) return 'Safe';
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);
//     return diff <= 3 ? 'Due Soon' : 'Safe';
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';
import { BorrowService } from '../../../services/borrow';

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
  currentBooks: { title: string; author: string; due: string; status: string; }[] = [];

  constructor(
    private authService: AuthService,
    private borrowService: BorrowService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.studentName = this.authService.getUser()?.fullName || 'Student';
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.borrowService.getStats().subscribe({
      next: (data: any) => {
        this.stats = [
          { title: 'Books Borrowed', value: data.booksIssued?.toString() || '0', icon: 'menu_book', color: 'blue' },
          { title: 'Return Due', value: data.overdueBooks?.toString() || '0', icon: 'event_busy', color: 'red' },
          { title: 'Pending Requests', value: '0', icon: 'hourglass_empty', color: 'orange' },
          { title: 'Total Read', value: '14', icon: 'check_circle', color: 'green' }
        ];
      }
    });

    this.http.get<any[]>('http://localhost:8080/api/borrow/current').subscribe({
      next: (books: any[]) => {
        this.currentBooks = books.map((book: any) => ({
          title: book.bookTitle,
          author: book.author || 'Unknown',
          due: book.dueDate || '',
          status: this.getBookStatus(book.dueDate || '')
        }));
      }
    });
  }

  get dueSoonCount() {
    return this.currentBooks.filter(book => book.status === 'Due Soon').length;
  }

  getBookStatus(dueDate: string) {
    if (!dueDate) return 'Safe';
    const today = new Date();
    const due = new Date(dueDate);
    const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff <= 3 ? 'Due Soon' : 'Safe';
  }
}