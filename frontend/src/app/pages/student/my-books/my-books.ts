import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-books.html',
  styleUrls: ['./my-books.css'] // No specific CSS needed, uses global styles
})
export class MyBooksComponent {
  borrowedBooks = [
    { title: 'Angular for Beginners', author: 'John Doe', borrowDate: 'Oct 10, 2023', dueDate: 'Oct 24, 2023', isOverdue: false },
    { title: 'Advanced Java', author: 'Jane Smith', borrowDate: 'Sep 01, 2023', dueDate: 'Sep 15, 2023', isOverdue: true },
  ];
}