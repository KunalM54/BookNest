import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';
import { SnackbarService } from '../../../services/snackbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  studentId: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  department: string = '';
  borrowed: number = 0;
  read: number = 0;
  
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Failed to load profile. Please login again.';
      return;
    }

    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/users/me`).subscribe({
      next: (data) => {
        this.studentId = data.id;
        const nameParts = data.fullName.split(' ');
        this.firstName = nameParts[0] || '';
        this.lastName = nameParts.slice(1).join(' ') || '';
        this.email = data.email;
        this.phone = data.phone || '';
        this.department = data.department || 'N/A';
        this.borrowed = data.borrowedCount || 0;
        this.read = data.readCount || 0;
        this.isLoading = false;
        
        this.authService.setSession({
          token,
          fullName: data.fullName,
          email: this.email,
          role: data.role,
          userId: this.studentId
        });
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.errorMessage = 'Failed to load profile. Please login again.';
        this.isLoading = false;
      }
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const fullName = `${this.firstName} ${this.lastName}`.trim();
    
    const updates = {
      fullName,
      email: this.email,
      phone: this.phone,
      department: this.department
    };

    this.http.put<any>(`${this.apiUrl}/users/${this.studentId}`, updates).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Profile updated successfully!';
          const token = this.authService.getToken();
          if (token) {
            this.authService.setSession({
              token,
              fullName,
              email: this.email,
              role: 'STUDENT',
              userId: this.studentId
            });
          }
          this.snackbar.show('Profile updated!');
        } else {
          this.errorMessage = response.message || 'Failed to update profile';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  get initials() {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`;
  }

}
