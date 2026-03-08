import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-books.html',
  styleUrls: ['./my-books.css']
})
export class MyBooksComponent {

  constructor(private snackbar: SnackbarService){}

  borrowedBooks = [
    {
      title: 'Angular for Beginners',
      author: 'John Doe',
      borrowDate: 'Oct 10, 2023',
      dueDate: 'Oct 24, 2023',
      isOverdue: false
    },
    {
      title: 'Advanced Java',
      author: 'Jane Smith',
      borrowDate: 'Sep 01, 2023',
      dueDate: 'Sep 15, 2023',
      isOverdue: true
    }
  ];

  returnBook(book:any){

    this.borrowedBooks = this.borrowedBooks.filter(b => b !== book);

    this.snackbar.show(`"${book.title}" returned successfully`);

  }

}