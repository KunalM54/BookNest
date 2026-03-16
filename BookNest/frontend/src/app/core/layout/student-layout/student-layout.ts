import { Component, OnInit } from '@angular/core';
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
export class StudentLayoutComponent implements OnInit {
  showLogoutModal = false;
  sidebarCollapsed = false;
  studentName: string = '';
  studentId: string = '';
  studentInitials: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStudentInfo();
  }

  loadStudentInfo() {
    const user = this.authService.getUser();
    if (user) {
      this.studentName = user.fullName || 'Student';
      this.studentId = user.studentId || user.sid || '';
      this.studentInitials = this.getInitials(this.studentName);
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
