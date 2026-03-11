import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../services/snackbar';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-books.html',
  styleUrls: ['./browse-books.css']
})
export class BrowseBooksComponent implements OnInit {
  searchTerm: string = '';
  loading = false;
  selectedCategory = 'All';
  books: any[] = [];
  categories: string[] = ['All', 'Technology', 'Fiction', 'Education', 'Science', 'History', 'Mathematics'];

  constructor(
    private snackbar: SnackbarService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/api/books')
      .subscribe({
        next: (books) => {
          this.books = books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            isbn: book.isbn,
            available: book.availableCopies > 0,
            availableCopies: book.availableCopies,
            totalCopies: book.totalCopies
          }));
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackbar.show('Failed to load books');
        }
      });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredBooks() {
    let filtered = this.books;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (book.isbn && book.isbn.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }

  requestBook(book: any) {
    if (!book.available) return;

    this.loading = true;
    const userId = this.authService.getUserId();
    
    if (!userId) {
      this.snackbar.show('Please login to request a book');
      this.loading = false;
      return;
    }

    // Use query parameters as per backend API
    this.http.post<any>(`http://localhost:8080/api/borrow/request?studentId=${userId}&bookId=${book.id}`, {})
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            book.available = false;
            book.availableCopies--;
            this.snackbar.show(`Request sent for "${book.title}"`);
          } else {
            this.snackbar.show(response.message || 'Failed to request book');
          }
        },
        error: (error) => {
          this.loading = false;
          this.snackbar.show(error.error?.message || 'Failed to request book');
        }
      });
  }
}

