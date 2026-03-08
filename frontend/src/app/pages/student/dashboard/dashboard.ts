import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  studentName = localStorage.getItem('username') || 'Student';
  get dueSoonCount() {
    return this.currentBooks.filter(book => book.status === 'Due Soon').length;
  }

  // 1. Student Stats
  stats = [
    { title: 'Books Borrowed', value: '2', icon: 'menu_book', color: 'blue' },
    { title: 'Return Due', value: '1', icon: 'event_busy', color: 'red' },
    { title: 'Pending Requests', value: '0', icon: 'hourglass_empty', color: 'orange' },
    { title: 'Total Read', value: '14', icon: 'check_circle', color: 'green' }
  ];

  // 2. Currently Borrowed Books
  currentBooks = [
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', due: 'Oct 28, 2023', status: 'Due Soon' },
    { title: 'Clean Architecture', author: 'Robert C. Martin', due: 'Nov 05, 2023', status: 'Safe' }
  ];

  getBookStatus(dueDate: string) {

    const today = new Date();
    const due = new Date(dueDate);

    const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (diff <= 3) return "Due Soon";
    return "Safe";
  }
}