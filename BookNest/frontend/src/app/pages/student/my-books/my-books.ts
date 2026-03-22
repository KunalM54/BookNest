import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BorrowService } from '../../../services/borrow';
import { AuthService } from '../../../services/auth';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalSearchBarComponent],
  templateUrl: './my-books.html',
  styleUrls: ['./my-books.css']
})
export class MyBooksComponent implements OnInit {

  borrowedBooks: any[] = [];
  filteredBooks: any[] = [];
  paginatedBooks: any[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  sortBy = 'newest';
  
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private borrowService: BorrowService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Please login to view your books';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.borrowService.getMyBooks(userId).subscribe({
      next: (books) => {
        if (books.length === 0) {
          this.errorMessage = 'No books borrowed currently.';
        } else {
          this.borrowedBooks = books.map((book: any) => ({
            id: book.id,
            title: book.bookTitle || book.title,
            author: book.bookAuthor || book.author || 'Unknown',
            bookImage: book.bookImage || null,
            borrowDate: book.requestDate || book.borrowDate,
            dueDate: book.dueDate,
            status: book.status,
            isOverdue: book.status === 'OVERDUE' || (book.dueDate && new Date(book.dueDate) < new Date())
          }));
        }
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books', err);
        this.errorMessage = 'Failed to load your books. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    let data = [...this.borrowedBooks];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
      );
    }

    data = this.sortBooks(data);
    this.filteredBooks = data;
    this.updatePagination();
  }

  sortBooks(data: any[]): any[] {
    return data.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.borrowDate || 0).getTime() - new Date(a.borrowDate || 0).getTime();
        case 'oldest':
          return new Date(a.borrowDate || 0).getTime() - new Date(b.borrowDate || 0).getTime();
        case 'titleAZ':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
  }

  updatePagination() {
    const total = this.filteredBooks.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.updatePagination();
  }

  goToPreviousPage() { this.goToPage(this.currentPage - 1); }
  goToNextPage() { this.goToPage(this.currentPage + 1); }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1, total);
    } else if (current >= total - 3) {
      pages.push(1, -1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1, -1, current - 1, current, current + 1, -2, total);
    }
    return pages;
  }

  get paginationStart(): number {
    return this.filteredBooks.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredBooks.length);
  }
}
