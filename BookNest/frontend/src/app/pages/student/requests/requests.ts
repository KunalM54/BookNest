
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { BorrowRequest, BorrowService } from '../../../services/borrow';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.html',
  styleUrls: ['./requests.css']
})
export class RequestsComponent implements OnInit {

  requests: any[] = [];
  isLoading = false;

  constructor(
    private borrowService: BorrowService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    const userId = this.authService.getUserId();
    this.borrowService.getMyRequestsHistory(userId || 0).subscribe({
      next: (data: BorrowRequest[]) => {
        this.requests = (data || []).map((req: BorrowRequest) => ({
          id: req.id,
          bookTitle: req.bookTitle || 'Unknown',
          requestDate: req.requestDate || '-',
          status: (req.status || 'PENDING').toUpperCase(),
          actionDate: req.actionDate || '-'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading requests', err);
        this.isLoading = false;
      }
    });
  }
}
