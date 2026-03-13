import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {

  totalBooks = 0;
  booksIssued = 0;
  overdueBooks = 0;
  activeStudents = 0;

  categoryStats: any[] = [];
  activities: any[] = [];

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.getToken()) {
      return;
    }

    this.loadStats();
    this.loadCategoryStats();
    this.loadActivities();
  }

  loadStats() {
    this.http.get<any>(`${this.apiUrl}/reports/stats`).subscribe({
      next: (data) => {
        this.totalBooks = data.totalBooks || 0;
        this.booksIssued = data.booksIssued || 0;
        this.overdueBooks = data.overdueBooks || 0;
        this.activeStudents = data.activeStudents || 0;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  loadCategoryStats() {
    this.http.get<any[]>(`${this.apiUrl}/reports/categories`).subscribe({
      next: (data) => {
        this.categoryStats = (data || []).map(item => ({
          name: item.name,
          count: Number(item.count) || 0
        }));
      },
      error: (err) => {
        console.error('Error loading category stats:', err);
        this.categoryStats = [];
      }
    });
  }

  loadActivities() {
    this.http.get<any[]>(`${this.apiUrl}/reports/activities`).subscribe({
      next: (data) => {
        this.activities = data;
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        // Fallback to mock data if API fails
        this.activities = [
          { user: 'John Doe', action: 'borrowed', book: 'Clean Code', time: '2 mins ago' },
          { user: 'Jane Smith', action: 'returned', book: 'The Great Gatsby', time: '1 hour ago' },
          { user: 'Admin', action: 'added new book', book: 'Angular Design Patterns', time: '3 hours ago' },
          { user: 'Mike Ross', action: 'requested', book: 'Data Structures', time: '5 hours ago' }
        ];
      }
    });
  }

  getBarColor(value: number) {

    if (value <= 30) {
      return '#93c5fd'; // light
    }

    if (value <= 60) {
      return '#3b82f6'; // medium
    }

    return '#1d4ed8'; // dark

  }

  downloadReport() {
    console.log("Generating report...");
    setTimeout(() => {
      console.log("Report downloaded");
    }, 1000);
  }

}
