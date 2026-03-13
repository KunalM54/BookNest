import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  userId: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  joinedDate: string = '';
  role: string = '';
  
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
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
        this.userId = data.id;
        this.role = data.role;
        const nameParts = data.fullName.split(' ');
        this.firstName = nameParts[0] || '';
        this.lastName = nameParts.slice(1).join(' ') || '';
        this.email = data.email;
        this.phone = data.phone || '';
        this.joinedDate = data.joinedDate || '';
        this.isLoading = false;
        
        this.authService.setSession({
          token,
          fullName: data.fullName,
          email: data.email,
          role: this.role,
          userId: this.userId
        });
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.errorMessage = 'Failed to load profile. Please login again.';
        this.isLoading = false;
      }
    });
  }

  saveProfile() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const loadingStart = Date.now();

    const fullName = `${this.firstName} ${this.lastName}`.trim();
    const normalizedPhone = this.sanitizePhone(this.phone);
    const normalizedEmail = (this.email || '').trim().toLowerCase();

    if (normalizedPhone && normalizedPhone.length !== 10) {
      this.isLoading = false;
      this.errorMessage = 'Phone number must be exactly 10 digits.';
      return;
    }
    
    const updates = {
      fullName: fullName,
      email: normalizedEmail,
      phone: normalizedPhone
    };

    this.http.put<any>(`${this.apiUrl}/users/${this.userId}`, updates).subscribe({
      next: (response) => {
        const elapsed = Date.now() - loadingStart;
        const delay = Math.max(0, 2000 - elapsed);
        setTimeout(() => {
          if (response.success) {
            if (response.forceLogout) {
              this.successMessage = 'Profile updated! Since you changed your email, please login with your new credentials.';
              setTimeout(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
              }, 2000);
            } else {
              this.successMessage = 'Profile updated successfully!';
              const token = this.authService.getToken();

              if (token) {
                this.authService.setSession({
                  token,
                  fullName: fullName,
                  email: normalizedEmail,
                  role: this.role,
                  userId: this.userId
                });
              }
            }
          } else {
            this.errorMessage = response.message || 'Failed to update profile';
          }
          this.isLoading = false;
          this.phone = normalizedPhone;
          this.email = normalizedEmail;
        }, delay);
      },
      error: (err) => {
        const elapsed = Date.now() - loadingStart;
        const delay = Math.max(0, 2000 - elapsed);
        setTimeout(() => {
          console.error('Error updating profile:', err);
          this.errorMessage = 'Failed to update profile. Please try again.';
          this.isLoading = false;
        }, delay);
      }
    });
  }

  onPhoneInput(value: string) {
    this.phone = this.sanitizePhone(value);
  }

  private sanitizePhone(value: string): string {
    return (value || '').replace(/\D/g, '').slice(0, 10);
  }
}
