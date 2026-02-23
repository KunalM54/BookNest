import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-borrow-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrow-requests.html',
  styleUrls: ['./borrow-requests.css']
})
export class BorrowRequestsComponent {
  requests = [
    { id: 1, studentName: 'John Doe', studentId: 'S101', bookTitle: 'Clean Code', date: 'Oct 24, 2023' },
    { id: 2, studentName: 'Jane Smith', studentId: 'S102', bookTitle: 'Data Structures', date: 'Oct 23, 2023' },
  ];

  approve(id: number) { alert('Approved Request ' + id); }
  reject(id: number) { alert('Rejected Request ' + id); }
}