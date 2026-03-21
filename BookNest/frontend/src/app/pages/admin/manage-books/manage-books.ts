
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Book, BookService } from '../../../services/book';
import { SnackbarService } from '../../../services/snackbar';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';

interface BookForm {
  id: number | null;
  title: string;
  isbn: string;
  author: string;
  category: string;
  imageData: string | null;
  totalCopies: number;
}

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GlobalSearchBarComponent],
  templateUrl: './manage-books.html',
  styleUrls: ['./manage-books.css']
})
export class ManageBooksComponent implements OnInit {
  private readonly maxImageSizeBytes = 2 * 1024 * 1024;
  readonly pageSize = 8;

  searchTerm = '';
  selectedCategory = 'All';
  sortBy = 'newest';
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
  form!: FormGroup;

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) { }

  capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  capitalizeTitle(): void {
    const titleControl = this.form.get('title');
    if (titleControl) {
      const value = titleControl.value || '';
      titleControl.setValue(this.capitalizeFirst(value), { emitEvent: false });
    }
  }

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
      totalCopies: 1
    };
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      author: ['', Validators.required],
      category: ['', Validators.required],
      totalCopies: [1, [Validators.required, Validators.min(1)]]
    });
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

    this.filteredBooks = this.sortBooks(this.filteredBooks);

    if (resetPage) {
      this.currentPage = 1;
    }
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
        default:
          return 0;
      }
    });
  }

  onSortChange() {
    this.filterBooks();
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
    this.createForm();
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
      totalCopies: book.totalCopies
    };
    this.createForm();
    this.form.patchValue({
      title: book.title,
      isbn: book.isbn,
      author: book.author,
      category: book.category,
      totalCopies: book.totalCopies
    });
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

  cleanIsbnInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Keep only digits
    if (value.length > 12) {
      value = value.slice(0, 12); // Trim to max 12
    }
    input.value = value;
    this.form.get('isbn')?.setValue(value, { emitEvent: true });
  }

  getBookInitial(book: Pick<Book, 'title'>): string {
    return book.title.trim().charAt(0).toUpperCase() || 'B';
  }

  saveBook() {
    console.log('=== SAVE BOOK CLICKED ===');
    console.log('isEditMode:', this.isEditMode);
    console.log('bookForm.id:', this.bookForm.id);
    console.log('form.valid:', this.form.valid);
    console.log('form.value:', this.form.value);

    if (this.form.invalid) {
      console.log('FORM IS INVALID - Errors:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const ctrl = this.form.get(key);
        console.log(`Field ${key}: value="${ctrl?.value}", errors=${JSON.stringify(ctrl?.errors)}, touched=${ctrl?.touched}`);
        ctrl?.markAsTouched();
      });
      this.snackbarService.show('Please correct the errors below.');
      return;
    }

    this.isLoading = true;

    const formValue = this.form.value;
    const payload = {
      ...(this.bookForm.id && { id: this.bookForm.id }),
      title: formValue.title.trim(),
      isbn: formValue.isbn.trim(),
      author: formValue.author.trim(),
      category: formValue.category,
      imageData: this.imagePreview,
      totalCopies: formValue.totalCopies,
      // availableCopies removed - backend handles automatically
      // availableCopies: formValue.totalCopies
    } as Book;

    console.log('=== ADD/UPDATE BOOK PAYLOAD ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('Form valid:', this.form.valid);
    console.log('Title:', formValue.title?.trim());
    console.log('ISBN:', formValue.isbn?.trim());
    console.log('Total copies:', formValue.totalCopies);
    console.log('================================');

    if (this.isEditMode && this.bookForm.id) {
      this.bookService.updateBook(this.bookForm.id, payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackbarService.show('Book updated successfully!');
            this.loadBooks();
            this.closeModal();
          } else {
            this.snackbarService.show(response.message || 'Failed to update book');
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.snackbarService.show('Failed to update book. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.bookService.addBook(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackbarService.show('Book added successfully!');
            this.loadBooks();
            this.closeModal();
          } else {
            this.snackbarService.show(response.message || 'Failed to add book');
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.snackbarService.show('Failed to add book. Please try again.');
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

  getFormErrors(): string {
    if (this.form.valid) return 'No errors';
    const errors: string[] = [];
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) {
        const errs = Object.keys(control.errors || {}).join(', ');
        errors.push(`${key}: ${errs}`);
      }
    });
    return errors.join(' | ');
  }
}
