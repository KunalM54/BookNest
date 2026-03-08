import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordStudent {

  constructor(private snackbar: SnackbarService) { }

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  errorMessage = '';

  form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

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

    if (!this.form.currentPassword || !this.form.newPassword || !this.form.confirmPassword) {
      this.errorMessage = "All fields are required.";
      return;
    }

    if (this.form.newPassword.length < 6) {
      this.errorMessage = "New password must be at least 6 characters.";
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    /* SUCCESS */

    this.snackbar.show("Password updated successfully");

    this.form = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

  }

}