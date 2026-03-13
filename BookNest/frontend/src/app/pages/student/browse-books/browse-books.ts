import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../services/snackbar';
import { AuthService } from '../../../services/auth';
import { Book, BookService } from '../../../services/book';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-books.html',
  styleUrls: ['./browse-books.css']
})
export class BrowseBooksComponent implements OnInit {
  searchTerm = '';
  loading = false;
  selectedCategory = 'All';
  books: Book[] = [];
  categories: string[] = ['All'];

  constructor(
    private snackbar: SnackbarService,
    private http: HttpClient,
    private authService: AuthService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books.map((book) => ({
          ...book,
          imageData: book.imageData ?? null
        }));
        this.categories = [
          'All',
          ...Array.from(new Set(this.books.map((book) => book.category).filter(Boolean))).sort()
        ];
        this.loading = false;
      },
      error: () => {
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
      filtered = filtered.filter((book) => book.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  getBookInitial(book: Book): string {
    return book.title.trim().charAt(0).toUpperCase() || 'B';
  }

  isAvailable(book: Book): boolean {
    return book.availableCopies > 0;
  }

  requestBook(book: Book) {
    if (!this.isAvailable(book)) return;

    this.loading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.snackbar.show('Please login to request a book');
      this.loading = false;
      return;
    }

    this.http.post<any>(`http://localhost:8080/api/borrow/request?studentId=${userId}&bookId=${book.id}`, {})
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            book.availableCopies = Math.max(0, book.availableCopies - 1);
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
