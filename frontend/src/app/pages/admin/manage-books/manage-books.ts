import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-books.html',
  styleUrls: ['./manage-books.css']
})
export class ManageBooksComponent {

  searchTerm = '';
  selectedCategory = 'All';

  books = [
    { title: 'Clean Code', isbn: '9780132350884', author: 'Robert C. Martin', category: 'Technology', totalCopies: 10, availableCopies: 8 },
    { title: 'The Pragmatic Programmer', isbn: '9780201616224', author: 'Andrew Hunt', category: 'Technology', totalCopies: 5, availableCopies: 0 },
    { title: 'Data Structures', isbn: '9780132354884', author: 'Unknown', category: 'Academic', totalCopies: 15, availableCopies: 12 },
  ];

  categories = [
    "All",
    "Technology",
    "Academic"
  ];

  /* FILTER LOGIC */

  get filteredBooks(){

    return this.books.filter(book => {

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

  setCategory(cat:string){
    this.selectedCategory = cat;
  }

  /* ACTIONS */

  deleteBook(isbn:string){

    this.books = this.books.filter(b => b.isbn !== isbn);

  }

  editBook(book:any){

    console.log("Editing book", book);

  }

}