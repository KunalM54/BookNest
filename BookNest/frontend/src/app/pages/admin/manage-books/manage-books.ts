import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book, BookService } from '../../../services/book';

interface BookForm {
  id: number | null;
  title: string;
  isbn: string;
  author: string;
  category: string;
  imageData: string | null;
  totalCopies: number;
  availableCopies: number;
}

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-books.html',
  styleUrls: ['./manage-books.css']
})
export class ManageBooksComponent implements OnInit {
  private readonly maxImageSizeBytes = 2 * 1024 * 1024;
  readonly pageSize = 8;

  searchTerm = '';
  selectedCategory = 'All';
  isLoading = false;
  errorMessage = '';
  selectedImageName = '';
  imagePreview: string | null = null;

  books: Book[] = [];
  filteredBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  currentPage = 1;
  totalPages = 1;

  categories = [
    'All',
    'Technology',
    'Academic',
    'Science',
    'Literature',
    'History'
  ];

  showModal = false;
  isEditMode = false;
  editingBook: Book | null = null;
  bookForm: BookForm = this.createEmptyForm();

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  private createEmptyForm(): BookForm {
    return {
      id: null,
      title: '',
      isbn: '',
      author: '',
      category: '',
      imageData: null,
      totalCopies: 1,
      availableCopies: 1
    };
  }

  loadBooks() {
    this.isLoading = true;
    this.bookService.getAllBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        this.filterBooks(false);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load books';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  filterBooks(resetPage = true) {
    this.filteredBooks = this.books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' ||
        book.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (resetPage) {
      this.currentPage = 1;
    }
    this.updatePagination();
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
    this.filterBooks();
  }

  onSearchChange() {
    this.filterBooks();
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
    if (this.filteredBooks.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredBooks.length);
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingBook = null;
    this.errorMessage = '';
    this.bookForm = this.createEmptyForm();
    this.imagePreview = null;
    this.selectedImageName = '';
    this.showModal = true;
  }

  openEditModal(book: Book) {
    this.isEditMode = true;
    this.editingBook = book;
    this.errorMessage = '';
    this.bookForm = {
      id: book.id ?? null,
      title: book.title,
      isbn: book.isbn,
      author: book.author,
      category: book.category,
      imageData: book.imageData ?? null,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    };
    this.imagePreview = book.imageData ?? null;
    this.selectedImageName = book.imageData ? 'Current saved cover' : '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingBook = null;
    this.imagePreview = null;
    this.selectedImageName = '';
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file.';
      input.value = '';
      return;
    }

    if (file.size > this.maxImageSizeBytes) {
      this.errorMessage = 'Image size must be 2 MB or smaller.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        this.errorMessage = 'Failed to read the selected image.';
        return;
      }

      this.bookForm.imageData = reader.result;
      this.imagePreview = reader.result;
      this.selectedImageName = file.name;
      this.errorMessage = '';
    };
    reader.onerror = () => {
      this.errorMessage = 'Failed to read the selected image.';
    };
    reader.readAsDataURL(file);
  }

  removeSelectedImage() {
    this.bookForm.imageData = null;
    this.imagePreview = null;
    this.selectedImageName = '';
  }

  onTotalCopiesChange() {
    if (this.bookForm.totalCopies < 1) {
      this.bookForm.totalCopies = 1;
    }

    if (this.bookForm.availableCopies > this.bookForm.totalCopies) {
      this.bookForm.availableCopies = this.bookForm.totalCopies;
    }
  }

  getBookInitial(book: Pick<Book, 'title'>): string {
    return book.title.trim().charAt(0).toUpperCase() || 'B';
  }

  saveBook() {
    if (!this.bookForm.title || !this.bookForm.isbn || !this.bookForm.author || !this.bookForm.category) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.bookForm.totalCopies < 1) {
      this.errorMessage = 'Total copies must be at least 1.';
      return;
    }

    if (this.bookForm.availableCopies < 0) {
      this.errorMessage = 'Available copies cannot be negative.';
      return;
    }

    if (this.bookForm.availableCopies > this.bookForm.totalCopies) {
      this.errorMessage = 'Available copies cannot be greater than total copies.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const payload: Book = {
      title: this.bookForm.title.trim(),
      isbn: this.bookForm.isbn.trim(),
      author: this.bookForm.author.trim(),
      category: this.bookForm.category,
      imageData: this.bookForm.imageData,
      totalCopies: this.bookForm.totalCopies,
      availableCopies: this.bookForm.availableCopies
    };

    if (this.isEditMode && this.bookForm.id) {
      payload.id = this.bookForm.id;
      this.bookService.updateBook(this.bookForm.id, payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBooks();
            this.closeModal();
          } else {
            this.errorMessage = response.message;
          }
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to update book';
          this.isLoading = false;
        }
      });
    } else {
      this.bookService.addBook(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBooks();
            this.closeModal();
          } else {
            this.errorMessage = response.message;
          }
          this.isLoading = false;
        },
        error: () => {
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
        error: () => {
          this.errorMessage = 'Failed to delete book';
          this.isLoading = false;
        }
      });
    }
  }
}
