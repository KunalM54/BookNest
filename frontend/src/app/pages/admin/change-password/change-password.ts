import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../services/snackbar';
import { AuthService } from '../../../services/auth';
import { strongPasswordPattern } from '../../../auth/auth.validators';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword {

  constructor(
    private snackbar: SnackbarService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  showCurrent = false;
  showNew = false;
  showConfirm = false;
  isLoading = false;
  submitted = false;

  errorMessage = '';
  successMessage = '';

  private apiUrl = 'http://localhost:8080/api';
  strongPasswordPattern = strongPasswordPattern;
  noWhitespacePattern = /^(?!\s*$).+/;

  form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  toggleCurrent(){
    this.showCurrent = !this.showCurrent;
  }

  toggleNew(){
    this.showNew = !this.showNew;
  }

  toggleConfirm(){
    this.showConfirm = !this.showConfirm;
  }

  changePassword(){

    this.errorMessage = '';
    this.successMessage = '';
    this.submitted = true;

    if(!this.form.currentPassword || !this.form.newPassword || !this.form.confirmPassword){
      return;
    }

    if (this.form.currentPassword.trim().length === 0) {
      return;
    }

    if (this.form.newPassword.trim().length === 0) {
      return;
    }

    if (this.form.confirmPassword.trim().length === 0) {
      return;
    }

    if (this.form.newPassword.length < 6 || this.form.newPassword.length > 64) {
      return;
    }

    if (!strongPasswordPattern.test(this.form.newPassword)) {
      return;
    }

    if(this.form.newPassword !== this.form.confirmPassword){
      return;
    }

    this.isLoading = true;
    const loadingStart = Date.now();
    const finalizeLoading = (fn: () => void) => {
      const elapsed = Date.now() - loadingStart;
      const remaining = Math.max(0, 2000 - elapsed);
      setTimeout(fn, remaining);
    };
    
    // Get user ID from the current tab session
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = "User not found. Please login again.";
      this.isLoading = false;
      return;
    }

    const passwordData = {
      currentPassword: this.form.currentPassword,
      newPassword: this.form.newPassword
    };

    this.http.put<any>(`${this.apiUrl}/users/${userId}/change-password`, passwordData)
      .subscribe({
        next: (response) => {
          finalizeLoading(() => {
            this.isLoading = false;
            if (response.success) {
              this.successMessage = response.message;
              this.snackbar.show("Password changed successfully! Please login with new password.");
              
              // Force logout after password change
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
            this.errorMessage = err.error?.message || "Failed to change password. Please check your current password.";
          });
        }
      });

  }

}
