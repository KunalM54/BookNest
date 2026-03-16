import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';
import { SnackbarService } from '../../../services/snackbar';
import { strongPasswordPattern } from '../../../auth/auth.validators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  activeTab: 'profile' | 'password' = 'profile';

  // Profile fields
  studentId: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  department: string = '';
  borrowed: number = 0;
  read: number = 0;
  
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Password fields
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordSubmitted = false;
  
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  departments: string[] = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Commerce',
    'Economics',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  strongPasswordPattern = strongPasswordPattern;
  noWhitespacePattern = /^(?!\s*$).+/;

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Failed to load profile. Please login again.';
      return;
    }

    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/users/me`).subscribe({
      next: (data) => {
        this.studentId = data.studentId || data.id;
        const nameParts = data.fullName.split(' ');
        this.firstName = nameParts[0] || '';
        this.lastName = nameParts.slice(1).join(' ') || '';
        this.email = data.email;
        this.phone = data.phone || '';
        this.department = data.department || 'N/A';
        if (!this.departments.includes(this.department)) {
          this.department = 'Computer Science';
        }
        this.borrowed = data.borrowedCount || 0;
        this.read = data.readCount || 0;
        this.isLoading = false;
        
        this.authService.setSession({
          token,
          fullName: data.fullName,
          email: this.email,
          role: data.role,
          userId: data.id,
          studentId: data.studentId || '',
          sid: data.studentId || ''
        });
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.errorMessage = 'Failed to load profile. Please login again.';
        this.isLoading = false;
      }
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const loadingStart = Date.now();

    const fullName = `${this.firstName} ${this.lastName}`.trim();
    const normalizedPhone = this.sanitizePhone(this.phone);
    const normalizedEmail = (this.email || '').trim().toLowerCase();

    if (normalizedPhone && normalizedPhone.length !== 10) {
      this.isLoading = false;
      this.errorMessage = 'Phone number must be exactly 10 digits.';
      return;
    }
    
    const updates = {
      fullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      department: this.department
    };

    this.http.put<any>(`${this.apiUrl}/users/${this.studentId}`, updates).subscribe({
      next: (response) => {
        const elapsed = Date.now() - loadingStart;
        const delay = Math.max(0, 2000 - elapsed);
        setTimeout(() => {
          if (response.success) {
            this.successMessage = 'Profile updated successfully!';
            const token = this.authService.getToken();
            if (response.forceLogout) {
              this.snackbar.show('Email changed. Please log in again.');
              this.authService.logout();
              this.router.navigate(['/login']);
              this.isLoading = false;
              return;
            }
            if (token) {
              this.authService.setSession({
                token,
                fullName,
                email: normalizedEmail,
                role: 'STUDENT',
                userId: this.studentId
              });
            }
            this.snackbar.show('Profile updated!');
          } else {
            this.errorMessage = response.message || 'Failed to update profile';
          }
          this.isLoading = false;
          this.phone = normalizedPhone;
          this.email = normalizedEmail;
        }, delay);
      },
      error: (err) => {
        const elapsed = Date.now() - loadingStart;
        const delay = Math.max(0, 2000 - elapsed);
        setTimeout(() => {
          console.error('Error updating profile:', err);
          this.errorMessage = 'Failed to update profile. Please try again.';
          this.isLoading = false;
        }, delay);
      }
    });
  }

  // Password methods
  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassword() {
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordSubmitted = true;

    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.passwordForm.newPassword.length < 6 || this.passwordForm.newPassword.length > 64) {
      return;
    }

    if (!strongPasswordPattern.test(this.passwordForm.newPassword)) {
      return;
    }

    this.isLoading = true;
    const loadingStart = Date.now();
    const finalizeLoading = (fn: () => void) => {
      const elapsed = Date.now() - loadingStart;
      const remaining = Math.max(0, 2000 - elapsed);
      setTimeout(fn, remaining);
    };

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = "User not found. Please login again.";
      this.isLoading = false;
      return;
    }

    const passwordData = {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    };

    this.http.put<any>(`${this.apiUrl}/users/${userId}/change-password`, passwordData)
      .subscribe({
        next: (response) => {
          finalizeLoading(() => {
            this.isLoading = false;
            if (response.success) {
              this.successMessage = response.message;
              this.snackbar.show("Password changed successfully!");
              setTimeout(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
              }, 2000);
            } else {
              this.errorMessage = response.message || "Failed to change password.";
            }
          });
        },
        error: (err) => {
          finalizeLoading(() => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || "Failed to change password.";
          });
        }
      });
  }

  get initials() {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`;
  }

  onPhoneInput(value: string) {
    this.phone = this.sanitizePhone(value);
  }

  private sanitizePhone(value: string): string {
    return (value || '').replace(/\D/g, '').slice(0, 10);
  }

}
