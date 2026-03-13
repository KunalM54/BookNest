import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Required for ngModel
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { AuthService } from '../../services/auth';
import { SnackbarService } from '../../services/snackbar';
import { noWhitespaceValidator } from '../auth.validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      noWhitespaceValidator,
      Validators.email,
      Validators.maxLength(100)
    ]),
    password: new FormControl('', [
      Validators.required,
      noWhitespaceValidator,
      Validators.minLength(6),
      Validators.maxLength(64)
    ])
  });

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  submitted = false;
  rememberMe = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private snackbar: SnackbarService
  ) { }

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
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = {
      email: (this.loginForm.value.email || '').trim().toLowerCase(),
      password: this.loginForm.value.password || '',
      rememberMe: this.rememberMe
    };

    this.isLoading = true;
    const loadingStart = Date.now();

    // Call backend API
    this.http.post<any>('http://localhost:8080/api/auth/login', credentials)
      .subscribe({
        next: (response) => {
          const elapsed = Date.now() - loadingStart;
          const delay = Math.max(0, 2000 - elapsed);
          setTimeout(() => {
            this.isLoading = false;
            if (response.success) {
              this.authService.setSession({
                token: response.token,
                fullName: response.fullName,
                email: response.email,
                role: response.role,
                userId: response.userId
              });
              this.snackbar.show(`Login successful. Welcome ${response.fullName || 'back'}!`);

              // Redirect based on role
              if (response.role === 'ADMIN') {
                this.router.navigate(['/admin/dashboard']);
              } else {
                this.router.navigate(['/student/dashboard']);
              }
            } else {
              this.errorMessage = response.message || "Login failed.";
            }
          }, delay);
        },
        error: (error) => {
          const elapsed = Date.now() - loadingStart;
          const delay = Math.max(0, 2000 - elapsed);
          setTimeout(() => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to log in.';
          }, delay);
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

