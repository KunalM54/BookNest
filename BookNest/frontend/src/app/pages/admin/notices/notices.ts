import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notice, NoticePayload, NoticePriority } from '../../../models/notice.model';
import { NoticeService } from '../../../services/notice';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';

interface NoticeForm {
  title: string;
  message: string;
  priority: NoticePriority;
}

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalSearchBarComponent],
  templateUrl: './notices.html',
  styleUrls: ['./notices.css']
})
export class NoticesComponent implements OnInit {
  readonly pageSize = 6;

  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  activeTab: 'all' | 'normal' | 'important' = 'all';

  notices: Notice[] = [];
  filteredNotices: Notice[] = [];
  paginatedNotices: Notice[] = [];
  currentPage = 1;
  totalPages = 1;

  showModal = false;
  isEditing = false;
  editingNotice: Notice | null = null;
  confirmDeleteId: number | null = null;
  noticeForm: NoticeForm = this.createEmptyForm();

  constructor(private noticeService: NoticeService) {}

  ngOnInit() {
    this.loadNotices();
  }

  setTab(tab: 'all' | 'normal' | 'important') {
    this.activeTab = tab;
    this.currentPage = 1;
    this.filterNotices(false);
  }

  getTabCount(tab: string): number {
    switch (tab) {
      case 'all':
        return this.notices.length;
      case 'normal':
        return this.notices.filter(n => !this.isHighPriority(n)).length;
      case 'important':
        return this.notices.filter(n => this.isHighPriority(n)).length;
      default:
        return 0;
    }
  }

  private filterByTab(): Notice[] {
    switch (this.activeTab) {
      case 'normal':
        return this.notices.filter(n => !this.isHighPriority(n));
      case 'important':
        return this.notices.filter(n => this.isHighPriority(n));
      default:
        return this.notices;
    }
  }

  private createEmptyForm(): NoticeForm {
    return {
      title: '',
      message: '',
      priority: 'NORMAL'
    };
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

  private getNoticePriorityWeight(notice: Notice): number {
    return this.isHighPriority(notice) ? 1 : 0;
  }

  private getNoticeTimestamp(notice: Notice): number {
    const dateValue = notice.updatedAt || notice.createdAt;
    return dateValue ? new Date(dateValue).getTime() : 0;
  }

  private sortNotices(notices: Notice[]): Notice[] {
    return [...notices].sort((first, second) => {
      const priorityDelta =
        this.getNoticePriorityWeight(second) - this.getNoticePriorityWeight(first);

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return this.getNoticeTimestamp(second) - this.getNoticeTimestamp(first);
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  loadNotices() {
    this.isLoading = true;
    this.noticeService.getAllNotices().subscribe({
      next: (data) => {
        this.notices = this.sortNotices(this.normalizeNotices(data));
        this.filterNotices(false);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notices:', err);
        this.errorMessage = 'Failed to load notices';
        this.isLoading = false;
      }
    });
  }

  filterNotices(resetPage = true) {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();
    
    let notices = this.filterByTab();

    this.filteredNotices = notices.filter((notice) => {
      if (!normalizedSearchTerm) {
        return true;
      }

      return (
        notice.title.toLowerCase().includes(normalizedSearchTerm) ||
        notice.message.toLowerCase().includes(normalizedSearchTerm)
      );
    });

    if (resetPage) {
      this.currentPage = 1;
    }

    this.updatePagination();
  }

  onSearchChange() {
    this.filterNotices();
  }

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredNotices.length / this.pageSize));

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedNotices = this.filteredNotices.slice(startIndex, startIndex + this.pageSize);
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

  openAddModal() {
    this.isEditing = false;
    this.editingNotice = null;
    this.errorMessage = '';
    this.noticeForm = this.createEmptyForm();
    this.showModal = true;
  }

  openEditModal(notice: Notice) {
    this.isEditing = true;
    this.editingNotice = notice;
    this.errorMessage = '';
    this.noticeForm = {
      title: notice.title,
      message: notice.message,
      priority: this.getNoticePriority(notice)
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditing = false;
    this.editingNotice = null;
    this.noticeForm = this.createEmptyForm();
  }

  saveNotice() {
    const title = this.noticeForm.title.trim();
    const message = this.noticeForm.message.trim();

    if (!title || !message) {
      this.errorMessage = 'Notice title and message are required';
      return;
    }

    const payload: NoticePayload = {
      title,
      message,
      priority: this.noticeForm.priority
    };

    this.errorMessage = '';
    this.isLoading = true;

    if (this.isEditing && this.editingNotice) {
      this.noticeService.updateNotice(this.editingNotice.id, payload).subscribe({
        next: (response) => {
          if (response.notice) {
            this.closeModal();
            this.loadNotices();
            return;
          }

          this.errorMessage = response.message ?? 'Failed to update notice';
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating notice:', err);
          this.errorMessage = 'Failed to update notice';
          this.isLoading = false;
        }
      });
      return;
    }

    this.noticeService.createNotice(payload).subscribe({
      next: (response) => {
        if (response.notice) {
          this.closeModal();
          this.loadNotices();
          return;
        }

        this.errorMessage = response.message ?? 'Failed to publish notice';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating notice:', err);
        this.errorMessage = 'Failed to publish notice';
        this.isLoading = false;
      }
    });
  }

  openDeleteDialog(id: number) {
    this.confirmDeleteId = id;
  }

  closeDeleteDialog() {
    this.confirmDeleteId = null;
  }

  deleteNotice() {
    if (this.confirmDeleteId === null) {
      return;
    }

    const noticeId = this.confirmDeleteId;
    this.isLoading = true;

    this.noticeService.deleteNotice(noticeId).subscribe({
      next: (response) => {
        if (response?.success === false) {
          this.errorMessage = response.message ?? 'Failed to delete notice';
        } else {
          this.notices = this.notices.filter((notice) => notice.id !== noticeId);
          this.filterNotices(false);
        }

        this.confirmDeleteId = null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting notice:', err);
        this.errorMessage = 'Failed to delete notice';
        this.confirmDeleteId = null;
        this.isLoading = false;
      }
    });
  }

  setNoticePriority(priority: NoticePriority) {
    this.noticeForm = {
      ...this.noticeForm,
      priority
    };
  }

  getNoticePriority(notice: Pick<Notice, 'priority' | 'isImportant'>): NoticePriority {
    return this.resolvePriority(notice.priority, notice.isImportant);
  }

  isHighPriority(notice: Pick<Notice, 'priority' | 'isImportant'>): boolean {
    return this.getNoticePriority(notice) === 'HIGH';
  }

  getPriorityLabel(notice: Pick<Notice, 'priority' | 'isImportant'>): string {
    return this.isHighPriority(notice) ? 'High' : 'Normal';
  }

  getPriorityDescription(notice: Pick<Notice, 'priority' | 'isImportant'>): string {
    return this.isHighPriority(notice) ? 'Important notice' : 'General notice';
  }

  getPrioritySearchLabel(notice: Pick<Notice, 'priority' | 'isImportant'>): string {
    return this.isHighPriority(notice) ? 'high important urgent' : 'normal general regular';
  }

  getNoticeDateTime(notice: Notice): string {
    return notice.updatedAt || notice.createdAt;
  }

  hasBeenUpdated(notice: Notice): boolean {
    return !!notice.updatedAt && notice.updatedAt !== notice.createdAt;
  }

  get totalNoticeCount(): number {
    return this.notices.length;
  }

  get generalNoticeCount(): number {
    return this.notices.filter((notice) => !this.isHighPriority(notice)).length;
  }

  get importantNoticeCount(): number {
    return this.notices.filter((notice) => this.isHighPriority(notice)).length;
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

  get paginationStart(): number {
    if (this.filteredNotices.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredNotices.length);
  }
}
