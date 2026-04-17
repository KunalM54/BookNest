import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../services/snackbar';
import {
  fullNamePattern,
  noWhitespaceValidator,
  passwordMatchValidator,
  strongPasswordPattern,
  studentIdPattern
} from '../auth.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm = new FormGroup(
    {
      fullName: new FormControl('', [
        Validators.required,
        noWhitespaceValidator,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(fullNamePattern)
      ]),
      sID: new FormControl('', [
        Validators.required,
        noWhitespaceValidator,
        Validators.pattern(studentIdPattern)
      ]),
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
        Validators.maxLength(64),
        Validators.pattern(strongPasswordPattern)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        noWhitespaceValidator
      ])
    },
    { validators: passwordMatchValidator }
  );

  showPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  errorMessage = '';
  submitted = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackbar: SnackbarService
  ) { }

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get sID() {
    return this.registerForm.get('sID');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();
    const payload = {
      fullName: (formValue.fullName || '').trim().replace(/\s+/g, ' '),
      studentId: (formValue.sID || '').trim().toUpperCase(),
      email: (formValue.email || '').trim().toLowerCase(),
      password: formValue.password || '',
      confirmPassword: formValue.confirmPassword || ''
    };

    this.isLoading = true;
    const loadingStart = Date.now();

    this.http.post<any>('http://localhost:8080/api/auth/register', payload)
      .subscribe({
        next: (response) => {
          const elapsed = Date.now() - loadingStart;
          const delay = Math.max(0, 2000 - elapsed);
          setTimeout(() => {
            this.isLoading = false;
            if (response.success) {
              this.snackbar.show('Registration successful. Please log in.');
              this.router.navigate(['/login']);
            } else {
              this.errorMessage = response.message || "Registration failed.";
            }
          }, delay);
        },
        error: (error) => {
          const elapsed = Date.now() - loadingStart;
          const delay = Math.max(0, 2000 - elapsed);
          setTimeout(() => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'An error occurred during registration.';
          }, delay);
        }
      });

  }

  loaderOptions = {
    path: 'assets/load.json',
    autoplay: true,
    loop: true
  };
}
