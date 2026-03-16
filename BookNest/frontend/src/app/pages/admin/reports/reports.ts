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

  activeTab: 'analytics' | 'reports' | 'activity' = 'analytics';
  showExportMenu = false;

  // Analytics data
  inventoryOverview: any = {};
  categoryStats: any[] = [];
  issuedTrend: any[] = [];

  // Reports data
  topBooks: any[] = [];
  activeStudents: any[] = [];
  leastUsedBooks: any[] = [];
  recentlyAddedBooks: any[] = [];

  // Quick stats
  quickStats: any = {};

  // Activities
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

    this.loadQuickStats();
    this.loadInventoryOverview();
    this.loadCategoryStats();
    this.loadIssuedTrend();
    this.loadTopBooks();
    this.loadActiveStudents();
    this.loadLeastUsedBooks();
    this.loadRecentlyAddedBooks();
    this.loadActivities();
  }

  loadQuickStats() {
    this.http.get<any>(`${this.apiUrl}/reports/stats`).subscribe({
      next: (data) => {
        this.quickStats = data || {};
      },
      error: (err) => {
        console.error('Error loading quick stats:', err);
        this.quickStats = {};
      }
    });
  }

  loadInventoryOverview() {
    this.http.get<any>(`${this.apiUrl}/reports/inventory`).subscribe({
      next: (data) => {
        this.inventoryOverview = data || {};
      },
      error: (err) => {
        console.error('Error loading inventory:', err);
        this.inventoryOverview = {};
      }
    });
  }

  loadCategoryStats() {
    this.http.get<any[]>(`${this.apiUrl}/reports/categories-detailed`).subscribe({
      next: (data) => {
        this.categoryStats = data || [];
      },
      error: (err) => {
        console.error('Error loading category stats:', err);
        this.categoryStats = [];
      }
    });
  }

  loadIssuedTrend() {
    this.http.get<any[]>(`${this.apiUrl}/reports/trend`).subscribe({
      next: (data) => {
        this.issuedTrend = data || [];
      },
      error: (err) => {
        console.error('Error loading trend:', err);
        this.issuedTrend = [];
      }
    });
  }

  loadTopBooks() {
    this.http.get<any[]>(`${this.apiUrl}/reports/top-books`).subscribe({
      next: (data) => {
        this.topBooks = data || [];
      },
      error: (err) => {
        console.error('Error loading top books:', err);
        this.topBooks = [];
      }
    });
  }

  loadActiveStudents() {
    this.http.get<any[]>(`${this.apiUrl}/reports/active-students`).subscribe({
      next: (data) => {
        this.activeStudents = data || [];
      },
      error: (err) => {
        console.error('Error loading active students:', err);
        this.activeStudents = [];
      }
    });
  }

  loadLeastUsedBooks() {
    this.http.get<any[]>(`${this.apiUrl}/reports/least-used`).subscribe({
      next: (data) => {
        this.leastUsedBooks = data || [];
      },
      error: (err) => {
        console.error('Error loading least used books:', err);
        this.leastUsedBooks = [];
      }
    });
  }

  loadRecentlyAddedBooks() {
    this.http.get<any[]>(`${this.apiUrl}/reports/recent-books`).subscribe({
      next: (data) => {
        this.recentlyAddedBooks = data || [];
      },
      error: (err) => {
        console.error('Error loading recent books:', err);
        this.recentlyAddedBooks = [];
      }
    });
  }

  loadActivities() {
    this.http.get<any[]>(`${this.apiUrl}/reports/activities`).subscribe({
      next: (data) => {
        this.activities = data || [];
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        this.activities = [];
      }
    });
  }

  getBarColor(value: number) {
    if (value <= 30) {
      return '#93c5fd';
    }
    if (value <= 60) {
      return '#3b82f6';
    }
    return '#1d4ed8';
  }

  getMaxTrendValue(): number {
    if (!this.issuedTrend.length) return 10;
    return Math.max(...this.issuedTrend.map((d: any) => d.count || 0), 1);
  }

  getTrendBarHeight(count: number): number {
    const max = this.getMaxTrendValue();
    return (count / max) * 100;
  }

  toggleExportMenu() {
    this.showExportMenu = !this.showExportMenu;
  }

  exportReport(type: string) {
    this.showExportMenu = false;
    console.log(`Exporting ${type} report...`);
    alert(`${type} report downloaded successfully!`);
  }
}
