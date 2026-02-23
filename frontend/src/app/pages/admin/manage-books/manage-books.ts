import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-books.html',
  styleUrls: ['./manage-books.css']
})
export class ManageBooksComponent {
  // Mock Data
  books = [
    { title: 'Clean Code', isbn: '9780132350884', author: 'Robert C. Martin', category: 'Technology', totalCopies: 10, availableCopies: 8 },
    { title: 'The Pragmatic Programmer', isbn: '9780201616224', author: 'Andrew Hunt', category: 'Technology', totalCopies: 5, availableCopies: 0 },
    { title: 'Data Structures', isbn: '9780132354884', author: 'Unknown', category: 'Academic', totalCopies: 15, availableCopies: 12 },
  ];
}