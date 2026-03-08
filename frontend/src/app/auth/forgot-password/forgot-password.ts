import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {

  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {}

  onSubmit() {

    this.errorMessage = '';
    this.successMessage = '';

    // 1️⃣ Empty check
    if(!this.email.trim()){
      this.errorMessage = "Please enter your email address.";
      return;
    }

    // 2️⃣ Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(this.email)){
      this.errorMessage = "Please enter a valid email address.";
      return;
    }

    // 3️⃣ Start loading
    this.isLoading = true;

    // 4️⃣ Simulate API call
    setTimeout(() => {

      this.isLoading = false;

      this.successMessage = "Password reset link has been sent to your email.";

      // 5️⃣ Redirect after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);

    }, 1500);
  }

}