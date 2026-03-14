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

  constructor(
    private authService: AuthService,
    private router: Router,
    private borrowService: BorrowService
  ) { }

  ngOnInit() {
    this.loadPendingCount();
  }

  loadPendingCount() {
    this.borrowService.getPendingRequests().subscribe({
      next: (requests) => {
        this.pendingCount = requests.length;
      },
      error: (err) => console.error('Failed to load pending count:', err)
    });
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
