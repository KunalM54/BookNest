import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  registerData = {
    fullName: '',
    sID: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  showPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {

    this.errorMessage = '';

    if (!this.registerData.fullName ||
      !this.registerData.sID ||
      !this.registerData.email ||
      !this.registerData.password ||
      !this.registerData.confirmPassword) {

      this.errorMessage = "All fields are required.";
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = "Password must be at least 6 characters.";
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    this.isLoading = true;

    // Call backend API
    this.http.post<any>('http://localhost:8080/api/auth/register', this.registerData)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Registration successful, redirect to login
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = response.message || "Registration failed.";
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || "An error occurred during registration.";
        }
      });

  }

  loaderOptions = {
    path: 'assets/load.json',
    autoplay: true,
    loop: true
  };
}
