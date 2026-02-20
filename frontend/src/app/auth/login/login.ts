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

  constructor(private router: Router) {}

  onLogin() {
    // 1. VALIDATION: Check if fields are empty
    if (this.credentials.email.trim() === '' || this.credentials.password.trim() === '') {
      alert("Please enter both email and password.");
      return; // Stop here! Do not redirect.
    }

    // 2. Check for Admin Credentials
    if (this.credentials.email === 'admin@gmail.com' && this.credentials.password === '123') {
      console.log('Admin Login Successful');
      this.router.navigate(['/admin/dashboard']);
    } 
    
    // 3. Check for Student (Simulated for now)
    else {
      // In a real app, this would be an API call verifying the user exists.
      // For now, we assume any non-admin input is a valid student for testing.
      console.log('Student Login Successful');
      this.router.navigate(['/student/dashboard']);
    }
  }
}