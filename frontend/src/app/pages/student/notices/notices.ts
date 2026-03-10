import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeService } from '../../../services/notice';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notices.html',
  styleUrls: ['./notices.css']
})
export class NoticesStudent implements OnInit {

  notices: any[] = [];
  isLoading: boolean = false;

  constructor(private noticeService: NoticeService) {}

  ngOnInit() {
    this.loadNotices();
  }

  // Format date from ISO string
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  loadNotices() {
    this.isLoading = true;
    this.noticeService.getAllNotices().subscribe({
      next: (data) => {
        this.notices = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notices:', err);
        this.isLoading = false;
      }
    });
  }
}
