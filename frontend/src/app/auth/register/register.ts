import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent, FooterComponent], 
  templateUrl: './register.html',
  styleUrls: ['./register.css'] // Reusing Login CSS for consistency
})
export class Register {
  
  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router) {}

  onRegister() {
    if(this.registerData.password !== this.registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    console.log('Register Data:', this.registerData);
    // TODO: Call API to create user
    
    // Redirect to Login
    this.router.navigate(['/login']);
  }
}