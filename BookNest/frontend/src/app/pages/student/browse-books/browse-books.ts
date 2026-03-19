import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar';
import { AuthService } from '../../../services/auth';
import { Book, BookService } from '../../../services/book';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalSearchBarComponent],
  templateUrl: './browse-books.html',
  styleUrls: ['./browse-books.css']
})
export class BrowseBooksComponent implements OnInit, OnDestroy {
  searchTerm = '';
  loading = false;
  selectedCategory = 'All';
  sortBy = 'newest';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  categories: string[] = ['All'];
  
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private snackbar: SnackbarService,
    private http: HttpClient,
    private authService: AuthService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.setupDebounce();
    this.loadBooks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDebounce() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchTerm);
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
        this.applyFilters();
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
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  onSearchChange() {
    // Kept for compatibility, but use onSearchInput for live search
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.books];

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

    filtered = this.sortBooks(filtered);

    this.filteredBooks = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  sortBooks(books: Book[]): Book[] {
    return books.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return (b.id || 0) - (a.id || 0);
        case 'oldest':
          return (a.id || 0) - (b.id || 0);
        case 'titleAZ':
          return a.title.localeCompare(b.title);
        case 'titleZA':
          return b.title.localeCompare(a.title);
        case 'authorAZ':
          return a.author.localeCompare(b.author);
        case 'available':
          return (b.availableCopies || 0) - (a.availableCopies || 0);
        default:
          return 0;
      }
    });
  }

  updatePagination() {
    const totalBooks = this.filteredBooks.length;
    this.totalPages = Math.max(1, Math.ceil(totalBooks / this.pageSize));
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToPreviousPage() {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get paginationStart(): number {
    if (this.filteredBooks.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredBooks.length);
  }

  get filteredBooksForDisplay() {
    return this.paginatedBooks;
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
