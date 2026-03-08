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
export class ChangePassword {

  constructor(private snackbar: SnackbarService) {}

  showCurrent = false;
  showNew = false;
  showConfirm = false;

  errorMessage = '';

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

    /* STATIC SUCCESS */

    this.snackbar.show("Password updated successfully");

    this.form = {
      currentPassword:'',
      newPassword:'',
      confirmPassword:''
    };

  }

}