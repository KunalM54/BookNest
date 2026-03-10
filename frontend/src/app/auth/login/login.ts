import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Required for ngModel
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  submitted = false;
  rememberMe = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    const credentials = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
      rememberMe: this.rememberMe
    };

    this.isLoading = true;

    // Call backend API
    this.http.post<any>('http://localhost:8080/api/auth/login', credentials)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
// Save token and user info
            this.authService.saveToken(response.token);
            this.authService.saveUser({
              fullName: response.fullName,
              email: response.email,
              role: response.role,
              userId: response.userId
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
