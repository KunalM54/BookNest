import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LottieComponent } from 'ngx-lottie';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent, LottieComponent],
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

  constructor(private router: Router) { }

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

    setTimeout(() => {

      console.log('Register Data:', this.registerData);

      this.isLoading = false;

      this.router.navigate(['/login']);

    }, 1500);

  }

  loaderOptions = {
    path: 'assets/load.json',
    autoplay: true,
    loop: true
  };
}