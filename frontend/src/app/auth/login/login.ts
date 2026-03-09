import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  onLogin() {

    if (this.credentials.email.trim() === '' || this.credentials.password.trim() === '') {
      this.errorMessage = "Email and password are required.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Call backend API
    this.http.post<any>('http://localhost:8080/api/auth/login', this.credentials)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Save token and user info
            this.authService.saveToken(response.token);
            this.authService.saveUser({
              fullName: response.fullName,
              email: response.email,
              role: response.role
            });

            // Redirect based on role
            if (response.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/student/dashboard']);
            }
          } else {
            this.errorMessage = response.message || "Login failed.";
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || "An error occurred during login.";
        }
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loaderOptions = {
    path: 'assets/load.json',
    autoplay: true,
    loop: true
  };



}
