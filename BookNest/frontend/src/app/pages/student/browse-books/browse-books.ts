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

  hasValidImage(book: Book): boolean {
    if (!book.imageData) return false;
    const trimmed = book.imageData.trim();
    return trimmed.length > 0;
  }

  getImageSource(book: Book): string {
    if (!book.imageData) return '';
    
    // Clean the image data
    let imageData = book.imageData.trim();
    
    // If it already has data: prefix, return as-is
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    
    // If it's pure base64, we need to detect the type
    // Try to detect PNG by checking the first few bytes after decoding
    try {
      // Base64 decode a small portion
      const decoded = atob(imageData.substring(0, 16));
      // Check for PNG magic bytes: 89 50 4E 47 (hex) = \x89PNG
      if (decoded.startsWith('\x89PNG')) {
        return `data:image/png;base64,${imageData}`;
      }
      // Check for JPEG magic bytes: FF D8 (hex) = \xFF\xD8
      if (decoded.startsWith('\xFF\xD8')) {
        return `data:image/jpeg;base64,${imageData}`;
      }
    } catch (e) {
      // If decoding fails, try common formats
      console.log('Could not detect image type, trying JPEG');
    }
    
    // Default to JPEG
    return `data:image/jpeg;base64,${imageData}`;
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
