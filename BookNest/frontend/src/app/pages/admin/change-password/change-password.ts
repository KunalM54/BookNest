import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../services/snackbar';
import { AuthService } from '../../../services/auth';

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

  errorMessage = '';
  successMessage = '';

  private apiUrl = 'http://localhost:8080/api';

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

    if(!this.form.currentPassword || !this.form.newPassword || !this.form.confirmPassword){
      this.errorMessage = "All fields are required.";
      return;
    }

    if(this.form.newPassword.length < 6){
      this.errorMessage = "Password must be at least 6 characters.";
      return;
    }

    if(this.form.newPassword !== this.form.confirmPassword){
      this.errorMessage = "Passwords do not match.";
      return;
    }

    this.isLoading = true;
    
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
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Failed to change password. Please check your current password.";
        }
      });

  }

}
