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
}