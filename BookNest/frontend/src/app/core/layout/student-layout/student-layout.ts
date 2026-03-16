import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './student-layout.html',
  styleUrls: ['./student-layout.css', './student-layout-modal.css']
})
export class StudentLayoutComponent {
  showLogoutModal = false;
  sidebarCollapsed = false;
  showUserDropdown = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown() {
    this.showUserDropdown = false;
  }

  openLogoutModal() {
    this.showUserDropdown = false;
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
