import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../../services/notice';
import { Notice, NoticePriority } from '../../../models/notice.model';
import { scrollToTop } from '../../../utils/scroll-to-top';

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
  expandedNoticeId: number | null = null;

  currentPage = 1;
  itemsPerPage = 6;

  constructor(private noticeService: NoticeService) {}

  ngOnInit() {
    this.loadNotices();
  }

  toggleNotice(noticeId: number) {
    this.expandedNoticeId = this.expandedNoticeId === noticeId ? null : noticeId;
  }

  isExpanded(noticeId: number): boolean {
    return this.expandedNoticeId === noticeId;
  }

  getFirstLine(message: string): string {
    if (!message) return '';
    const lines = message.split('\n');
    return lines[0].substring(0, 80) + (lines[0].length > 80 ? '...' : '');
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

  get displayedNotices(): Notice[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.notices.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.notices.length / this.itemsPerPage));
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1, total);
    } else if (current >= total - 3) {
      pages.push(1, -1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1, -1, current - 1, current, current + 1, -2, total);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    scrollToTop();
  }

  goToPreviousPage() {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }
}
