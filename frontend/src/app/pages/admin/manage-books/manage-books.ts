import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-books.html',
  styleUrls: ['./manage-books.css']
})
export class ManageBooksComponent implements OnInit {

  searchTerm = '';
  selectedCategory = 'All';
  isLoading = false;
  errorMessage = '';

  books: any[] = [];
  filteredBooks: any[] = [];

  categories = [
    "All",
    "Technology",
    "Academic",
    "Science",
    "Literature",
    "History"
  ];

  // For add/edit modal
  showModal = false;
  isEditMode = false;
  editingBook: any = null;
  
  bookForm = {
    id: null,
    title: '',
    isbn: '',
    author: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1
  };

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.filterBooks();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load books';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  /* FILTER LOGIC */

  filterBooks() {
    this.filteredBooks = this.books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.isbn.includes(this.searchTerm);

      const matchesCategory =
        this.selectedCategory === "All" ||
        book.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
    this.filterBooks();
  }

  onSearchChange() {
    this.filterBooks();
  }

  /* MODAL OPERATIONS */

  openAddModal() {
    this.isEditMode = false;
    this.editingBook = null;
    this.bookForm = {
      id: null,
      title: '',
      isbn: '',
      author: '',
      category: '',
      totalCopies: 1,
      availableCopies: 1
    };
    this.showModal = true;
  }

  openEditModal(book: any) {
    this.isEditMode = true;
    this.editingBook = book;
    this.bookForm = {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      author: book.author,
      category: book.category,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingBook = null;
  }

  /* CRUD OPERATIONS */

  saveBook() {
    if (!this.bookForm.title || !this.bookForm.isbn || !this.bookForm.author || !this.bookForm.category) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    if (this.isEditMode && this.bookForm.id) {
      // Update existing book
      this.bookService.updateBook(this.bookForm.id, this.bookForm).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBooks();
            this.closeModal();
          } else {
            this.errorMessage = response.message;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update book';
          this.isLoading = false;
        }
      });
    } else {
      // Add new book
      this.bookService.addBook(this.bookForm).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBooks();
            this.closeModal();
          } else {
            this.errorMessage = response.message;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to add book';
          this.isLoading = false;
        }
      });
    }
  }

  deleteBook(id: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.isLoading = true;
      this.bookService.deleteBook(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBooks();
          } else {
            this.errorMessage = response.message;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete book';
          this.isLoading = false;
        }
      });
    }
  }
}
