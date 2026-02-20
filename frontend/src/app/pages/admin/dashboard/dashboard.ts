import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  
  // 1. Stats Data
  stats = [
    { title: 'Total Books', value: '1,240', icon: 'library_books', color: 'blue' },
    { title: 'Active Members', value: '350', icon: 'group', color: 'green' },
    { title: 'Books Issued', value: '128', icon: 'menu_book', color: 'orange' },
    { title: 'Overdue Books', value: '12', icon: 'warning', color: 'red' }
  ];

  // 2. Recent Borrow Requests (Mock Data)
  requests = [
    { id: 101, student: 'John Doe', book: 'Clean Code', date: 'Oct 24, 2023', status: 'Pending' },
    { id: 102, student: 'Jane Smith', book: 'Data Structures', date: 'Oct 23, 2023', status: 'Pending' },
    { id: 103, student: 'Mike Ross', book: 'The Pragmatic Programmer', date: 'Oct 22, 2023', status: 'Pending' }
  ];

  // Action Methods (Placeholder)
  approveRequest(id: number) {
    console.log(`Approved request ${id}`);
    this.requests = this.requests.filter(r => r.id !== id); // Remove from list for UI effect
  }

  rejectRequest(id: number) {
    console.log(`Rejected request ${id}`);
    this.requests = this.requests.filter(r => r.id !== id);
  }
}