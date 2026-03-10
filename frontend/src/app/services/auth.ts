import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Save user info to localStorage
  saveUser(user: { fullName: string; email: string; role: string; userId?: number }): void {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.userId) {
      localStorage.setItem('userId', user.userId.toString());
    }
  }

  // Get user info from localStorage
  getUser(): { fullName: string; email: string; role: string; userId?: number } | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Get user ID from localStorage
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get user role
  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  // Check if user is student
  isStudent(): boolean {
    return this.getUserRole() === 'STUDENT';
  }

  // Logout - clear all storage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }
}
