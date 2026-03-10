import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../../../services/notice';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notices.html',
  styleUrls: ['./notices.css']
})
export class NoticesComponent implements OnInit {

  // Variables to handle form data
  noticeTitle: string = '';
  noticeMessage: string = '';

  // Track editing state
  isEditing: boolean = false;
  currentNoticeId: number | null = null;

  // Notices from database
  notices: any[] = [];

  // Loading state
  isLoading: boolean = false;

  confirmDeleteId: number | null = null;

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

  // Format time from ISO string
  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Load notices from backend
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

  openDeleteDialog(id: number) {
    this.confirmDeleteId = id;
  }

  closeDeleteDialog() {
    this.confirmDeleteId = null;
  }

  deleteNotice() {
    if (this.confirmDeleteId === null) return;

    this.noticeService.deleteNotice(this.confirmDeleteId).subscribe({
      next: () => {
        this.notices = this.notices.filter(n => n.id !== this.confirmDeleteId);
        this.confirmDeleteId = null;
      },
      error: (err) => {
        console.error('Error deleting notice:', err);
        this.confirmDeleteId = null;
      }
    });
  }

  // 1. Handle Submit (Create OR Update)
  onSubmit() {
    if (!this.noticeTitle || !this.noticeMessage) return;

    const noticeData = {
      title: this.noticeTitle,
      message: this.noticeMessage,
      isImportant: false
    };

    if (this.isEditing && this.currentNoticeId !== null) {
      // UPDATE EXISTING NOTICE
      this.noticeService.updateNotice(this.currentNoticeId, noticeData).subscribe({
        next: (response) => {
          const index = this.notices.findIndex(n => n.id === this.currentNoticeId);
          if (index !== -1) {
            this.notices[index] = response.notice;
          }
          this.isEditing = false;
          this.currentNoticeId = null;
          this.resetForm();
          this.loadNotices();
        },
        error: (err) => {
          console.error('Error updating notice:', err);
        }
      });
    } else {
      // CREATE NEW NOTICE
      this.noticeService.createNotice(noticeData).subscribe({
        next: (response) => {
          this.notices.unshift(response.notice);
          this.resetForm();
          this.loadNotices();
        },
        error: (err) => {
          console.error('Error creating notice:', err);
        }
      });
    }
  }

  // 2. Load Data into Form for Editing
  onEdit(notice: any) {
    this.isEditing = true;
    this.currentNoticeId = notice.id;
    this.noticeTitle = notice.title;
    this.noticeMessage = notice.message;
  }

  // 3. Delete Notice
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this notice?')) {
      this.noticeService.deleteNotice(id).subscribe({
        next: () => {
          this.notices = this.notices.filter(n => n.id !== id);
        },
        error: (err) => {
          console.error('Error deleting notice:', err);
        }
      });
    }
  }

  // 4. Cancel Edit Mode
  cancelEdit() {
    this.isEditing = false;
    this.currentNoticeId = null;
    this.noticeTitle = '';
    this.noticeMessage = '';
  }

  // Reset form
  resetForm() {
    this.noticeTitle = '';
    this.noticeMessage = '';
  }
}
