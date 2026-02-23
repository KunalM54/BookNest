import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notices.html',
  styleUrls: ['./notices.css']
})
export class NoticesComponent {
  
  // Variables to handle form data
  noticeTitle: string = '';
  noticeMessage: string = '';
  
  // Track editing state
  isEditing: boolean = false;
  currentNoticeId: number | null = null;

  // Mock Data
  notices = [
    { id: 1, title: 'Library Maintenance', date: 'Oct 25, 2023', message: 'The library server will be down for maintenance on Sunday.' },
    { id: 2, title: 'New Books Arrival', date: 'Oct 20, 2023', message: 'We have added 50 new books to the Science section.' }
  ];

  // 1. Handle Submit (Create OR Update)
  onSubmit() {
    if (!this.noticeTitle || !this.noticeMessage) return;

    if (this.isEditing && this.currentNoticeId !== null) {
      // UPDATE EXISTING NOTICE
      const index = this.notices.findIndex(n => n.id === this.currentNoticeId);
      if (index !== -1) {
        this.notices[index].title = this.noticeTitle;
        this.notices[index].message = this.noticeMessage;
        // Keep original date or update it? Let's keep original for now.
      }
      this.isEditing = false;
      this.currentNoticeId = null;
    } else {
      // CREATE NEW NOTICE
      const newNotice = {
        id: Date.now(), // Generate unique ID
        title: this.noticeTitle,
        message: this.noticeMessage,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      this.notices.unshift(newNotice); // Add to top of list
    }

    // Reset Form
    this.noticeTitle = '';
    this.noticeMessage = '';
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
    if(confirm('Are you sure you want to delete this notice?')) {
      this.notices = this.notices.filter(n => n.id !== id);
    }
  }

  // 4. Cancel Edit Mode
  cancelEdit() {
    this.isEditing = false;
    this.currentNoticeId = null;
    this.noticeTitle = '';
    this.noticeMessage = '';
  }
}