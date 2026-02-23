import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-books.html',
  styleUrls: ['./browse-books.css']
})
export class BrowseBooksComponent {
  searchTerm: string = '';
  
  books = [
    { title: 'Clean Code', author: 'Robert C. Martin', category: 'Tech', available: true },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: false },
    { title: 'Intro to Algorithms', author: 'Thomas H. Cormen', category: 'Education', available: true },
    { title: 'Design Patterns', author: 'Erich Gamma', category: 'Tech', available: true },
  ];

  requestBook(book: any) {
    alert(`Request sent for: ${book.title}`);
  }
}