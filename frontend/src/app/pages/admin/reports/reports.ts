import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent {
  
  // Fake Data for Chart
  categoryStats = [
    { name: 'Computer Science', count: 45 },
    { name: 'Fiction', count: 25 },
    { name: 'History', count: 15 },
    { name: 'Science', count: 10 },
    { name: 'Others', count: 5 }
  ];

  // Fake Activity Log
  activities = [
    { user: 'John Doe', action: 'borrowed', book: 'Clean Code', time: '2 mins ago' },
    { user: 'Jane Smith', action: 'returned', book: 'The Great Gatsby', time: '1 hour ago' },
    { user: 'Admin', action: 'added new book', book: 'Angular Design Patterns', time: '3 hours ago' },
    { user: 'Mike Ross', action: 'requested', book: 'Data Structures', time: '5 hours ago' }
  ];

  downloadReport() {
    alert('Downloading PDF Report...');
  }
}