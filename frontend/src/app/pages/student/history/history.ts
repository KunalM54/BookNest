import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html'
})
export class HistoryComponent {
  history = [
    { title: 'Harry Potter', borrowDate: 'Jan 10, 2023', returnDate: 'Jan 20, 2023' },
    { title: 'Calculus I', borrowDate: 'Feb 15, 2023', returnDate: 'Mar 01, 2023' },
  ];
}