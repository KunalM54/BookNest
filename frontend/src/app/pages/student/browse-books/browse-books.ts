import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-books.html',
  styleUrls: ['./browse-books.css']
})
export class BrowseBooksComponent {
  constructor(private snackbar: SnackbarService) { }
  searchTerm: string = '';
  loading = false;
  selectedCategory = 'All';

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  books = [
    { title: 'Clean Code', author: 'Robert C. Martin', category: 'Tech', available: true },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: false },
    { title: 'Intro to Algorithms', author: 'Thomas H. Cormen', category: 'Education', available: true },
    { title: 'Design Patterns', author: 'Erich Gamma', category: 'Tech', available: true },
  ];


  get filteredBooks() {

    let filtered = this.books;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  requestBook(book: any) {

    if (!book.available) return;

    this.loading = true;

    setTimeout(() => {

      book.available = false;
      this.loading = false;

      this.snackbar.show(`Request sent for "${book.title}"`);

    }, 1000);

  }
}