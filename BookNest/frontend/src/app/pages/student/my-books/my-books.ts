import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowService, BorrowRequest } from '../../../services/borrow';
import { SnackbarService } from '../../../services/snackbar';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-books.html',
  styleUrls: ['./my-books.css']
})
export class MyBooksComponent implements OnInit {

  borrowedBooks: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private borrowService: BorrowService,
    private snackbar: SnackbarService,
    private authService: AuthService
  ) {}

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
          this.borrowedBooks = books.map((book:any) => ({
            id: book.id,
            title: book.bookTitle || book.title,
            author: book.author || book.bookAuthor || 'Unknown',
            borrowDate: book.requestDate,
            dueDate: book.dueDate,
            isOverdue: book.dueDate && new Date(book.dueDate) < new Date()
          }));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books', err);
        this.errorMessage = 'Failed to load your books. Please try again.';
        this.snackbar.show(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  returnBook(book: any) {
    if (confirm('Are you sure you want to return this book?')) {
      this.isLoading = true;
      this.borrowService.returnBook(book.id).subscribe({
        next: () => {
          this.borrowedBooks = this.borrowedBooks.filter(b => b.id !== book.id);
          this.snackbar.show(`"${book.title}" returned successfully`);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error returning book', err);
          this.snackbar.show('Error returning book. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

}