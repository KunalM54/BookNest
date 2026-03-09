import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  constructor(private router: Router) { }

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  onLogin() {

    if (this.credentials.email.trim() === '' || this.credentials.password.trim() === '') {
      this.errorMessage = "Email and password are required.";
      return;
    }

    this.isLoading = true;

    setTimeout(() => {

      if (this.credentials.email === 'admin@gmail.com' && this.credentials.password === '123456') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/student/dashboard']);
      }

      this.isLoading = false;

    }, 1500);
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