
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { BorrowService } from '../../../services/borrow';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {

  history: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private borrowService: BorrowService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Please login to view your history';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.borrowService.getHistory(userId).subscribe({
      next: (data) => {
        this.history = (data || []).map((record: any) => ({
          id: record.id,
          title: record.bookTitle || record.title || 'Unknown',
          borrowDate: record.requestDate || record.borrowDate || null,
          returnDate: record.returnDate || null,
          status: record.status || 'PENDING'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading history', err);
        this.errorMessage = 'Failed to load history. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
