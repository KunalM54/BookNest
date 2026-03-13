import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../../services/notice';
import { Notice, NoticePriority } from '../../../models/notice.model';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notices.html',
  styleUrls: ['./notices.css']
})
export class NoticesStudent implements OnInit {

  notices: Notice[] = [];
  isLoading: boolean = false;

  constructor(private noticeService: NoticeService) {}

  ngOnInit() {
    this.loadNotices();
  }

  private resolvePriority(priority?: NoticePriority, isImportant?: boolean): NoticePriority {
    return priority === 'HIGH' || isImportant ? 'HIGH' : 'NORMAL';
  }

  private normalizeNotices(notices: Notice[]): Notice[] {
    return notices.map((notice) => ({
      ...notice,
      priority: this.resolvePriority(notice.priority, notice.isImportant)
    }));
  }

  private getNoticeTimestamp(notice: Notice): number {
    const dateValue = notice.updatedAt || notice.createdAt;
    return dateValue ? new Date(dateValue).getTime() : 0;
  }

  private sortNotices(notices: Notice[]): Notice[] {
    return [...notices].sort((first, second) => {
      const priorityDelta =
        (this.isHighPriority(second) ? 1 : 0) - (this.isHighPriority(first) ? 1 : 0);

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return this.getNoticeTimestamp(second) - this.getNoticeTimestamp(first);
    });
  }

  getNoticePriority(notice: Pick<Notice, 'priority' | 'isImportant'>): NoticePriority {
    return this.resolvePriority(notice.priority, notice.isImportant);
  }

  isHighPriority(notice: Pick<Notice, 'priority' | 'isImportant'>): boolean {
    return this.getNoticePriority(notice) === 'HIGH';
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
        this.notices = this.sortNotices(this.normalizeNotices(data));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notices:', err);
        this.isLoading = false;
      }
    });
  }
}
