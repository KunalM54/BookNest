import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BorrowService } from '../../../services/borrow';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css', './admin-layout-modal.css']
})
export class AdminLayoutComponent implements OnInit {
  pendingCount: number = 0;
  showLogoutModal = false;
  sidebarCollapsed = true;
  adminName: string = '';
  adminEmail: string = '';
  adminInitials: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private borrowService: BorrowService
  ) { }

  ngOnInit() {
    this.loadPendingCount();
    this.loadAdminInfo();
  }

  loadAdminInfo() {
    const user = this.authService.getUser();
    if (user) {
      this.adminName = user.fullName || 'Administrator';
      this.adminEmail = user.email || '';
      this.adminInitials = this.getInitials(this.adminName);
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  loadPendingCount() {
    this.borrowService.getPendingRequests().subscribe({
      next: (requests) => {
        this.pendingCount = requests.length;
      },
      error: (err) => console.error('Failed to load pending count:', err)
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showLogoutModal = false;
  }
}
