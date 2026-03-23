import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {

  activeTab: 'overview' | 'books' | 'activity' = 'overview';
  showExportMenu = false;
  isLoading = false;

  stats: any = {};
  inventory: any = {};
  issuedTrend: any[] = [];
  categoryStats: any[] = [];
  topBooks: any[] = [];
  activeStudents: any[] = [];
  activities: any[] = [];

  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.isLoading = true;
    this.loadStats(); this.loadInventory(); this.loadTrend();
    this.loadCategories(); this.loadTopBooks();
    this.loadActiveStudents(); this.loadActivities();
    setTimeout(() => this.isLoading = false, 800);
  }

  loadStats() {
    this.http.get<any>(`${this.apiUrl}/reports/stats`).subscribe({ next: d => this.stats = d || {}, error: () => {} });
  }
  loadInventory() {
    this.http.get<any>(`${this.apiUrl}/reports/inventory`).subscribe({ next: d => this.inventory = d || {}, error: () => {} });
  }
  loadTrend() {
    this.http.get<any[]>(`${this.apiUrl}/reports/trend`).subscribe({ next: d => this.issuedTrend = d || [], error: () => {} });
  }
  loadCategories() {
    this.http.get<any[]>(`${this.apiUrl}/reports/categories-detailed`).subscribe({ next: d => this.categoryStats = d || [], error: () => {} });
  }
  loadTopBooks() {
    this.http.get<any[]>(`${this.apiUrl}/reports/top-books`).subscribe({ next: d => this.topBooks = (d || []).slice(0,10), error: () => {} });
  }
  loadActiveStudents() {
    this.http.get<any[]>(`${this.apiUrl}/reports/active-students`).subscribe({ next: d => this.activeStudents = (d || []).slice(0,10), error: () => {} });
  }
  loadActivities() {
    this.http.get<any[]>(`${this.apiUrl}/reports/activities`).subscribe({ next: d => this.activities = (d || []).slice(0,20), error: () => {} });
  }

  getTrendMax(): number { return Math.max(...this.issuedTrend.map(d => d.count || 0), 1); }
  getTrendBarPct(count: number): number { return (count / this.getTrendMax()) * 100; }
  getCategoryMax(): number { return Math.max(...this.categoryStats.map(c => c.count || 0), 1); }
  getCategoryBarPct(count: number): number { return (count / this.getCategoryMax()) * 100; }
  getCategoryColor(i: number): string {
    return ['#2563EB','#7C3AED','#059669','#D97706','#DC2626','#0891B2'][i % 6];
  }
  getTopBookMax(): number { return Math.max(...this.topBooks.map(b => b.count || 0), 1); }
  getTopBookBarPct(count: number): number { return (count / this.getTopBookMax()) * 100; }
  toggleExportMenu() { this.showExportMenu = !this.showExportMenu; }

  exportCSV() {
    this.showExportMenu = false;
    const rows: any[][] = [
      ['BOOKNEST LIBRARY REPORT'], [`Generated: ${new Date().toLocaleDateString()}`], [],
      ['SUMMARY'], ['Total Books', this.stats.totalBooks ?? 0],
      ['Books Issued', this.stats.booksIssued ?? 0],
      ['Active Students', this.stats.activeStudents ?? 0],
      ['Overdue Books', this.stats.overdueBooks ?? 0], [],
      ['TOP BORROWED BOOKS'], ['Rank','Title','Times Borrowed'],
      ...this.topBooks.map((b,i) => [i+1, b.title, b.count]), [],
      ['MOST ACTIVE STUDENTS'], ['Rank','Name','Books Borrowed'],
      ...this.activeStudents.map((s,i) => [i+1, s.name, s.count]), [],
      ['ISSUANCE TREND (Last 7 Days)'], ['Day','Count'],
      ...this.issuedTrend.map(d => [d.day, d.count]), [],
      ['CATEGORY DISTRIBUTION'], ['Category','Books','Percentage'],
      ...this.categoryStats.map(c => [c.name, c.count, `${c.percentage}%`])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    this.downloadFile(csv, 'booknest-report.csv', 'text/csv');
  }

  exportPDF() {
    this.showExportMenu = false;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>BookNest Report</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:40px}
.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #2563EB;padding-bottom:20px;margin-bottom:32px}
.logo{font-size:26px;font-weight:800;color:#2563EB}.logo span{color:#7c3aed}.date{font-size:13px;color:#64748b}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:32px}
.sb{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center}
.sb .v{font-size:28px;font-weight:800;color:#2563EB}.sb .l{font-size:12px;color:#64748b;margin-top:4px}
h2{font-size:15px;font-weight:700;border-left:4px solid #2563EB;padding-left:10px;margin-bottom:14px}
table{width:100%;border-collapse:collapse;margin-bottom:32px;font-size:13px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase}
td{padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#334155}
.r{font-weight:700;color:#2563EB}.c{font-weight:700;color:#059669}</style></head><body>
<div class="header"><div class="logo">Book<span>Nest</span></div><div class="date">Generated: ${new Date().toLocaleString()}</div></div>
<div class="stats">
<div class="sb"><div class="v">${this.stats.totalBooks??0}</div><div class="l">Total Books</div></div>
<div class="sb"><div class="v">${this.stats.booksIssued??0}</div><div class="l">Books Issued</div></div>
<div class="sb"><div class="v">${this.stats.activeStudents??0}</div><div class="l">Active Students</div></div>
<div class="sb"><div class="v">${this.stats.overdueBooks??0}</div><div class="l">Overdue Books</div></div>
</div>
<h2>Top Borrowed Books</h2>
<table><thead><tr><th>#</th><th>Book Title</th><th>Times Borrowed</th></tr></thead><tbody>
${this.topBooks.map((b,i)=>`<tr><td class="r">${i+1}</td><td>${b.title}</td><td class="c">${b.count}</td></tr>`).join('')}
${!this.topBooks.length?'<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:24px">No data</td></tr>':''}
</tbody></table>
<h2>Most Active Students</h2>
<table><thead><tr><th>#</th><th>Student Name</th><th>Books Borrowed</th></tr></thead><tbody>
${this.activeStudents.map((s,i)=>`<tr><td class="r">${i+1}</td><td>${s.name}</td><td class="c">${s.count}</td></tr>`).join('')}
${!this.activeStudents.length?'<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:24px">No data</td></tr>':''}
</tbody></table>
<h2>Category Distribution</h2>
<table><thead><tr><th>Category</th><th>Books</th><th>Percentage</th></tr></thead><tbody>
${this.categoryStats.map(c=>`<tr><td>${c.name}</td><td class="c">${c.count}</td><td>${c.percentage}%</td></tr>`).join('')}
</tbody></table>
<h2>Issuance Trend — Last 7 Days</h2>
<table><thead><tr><th>Day</th><th>Date</th><th>Books Issued</th></tr></thead><tbody>
${this.issuedTrend.map(d=>`<tr><td>${d.day}</td><td>${d.date||''}</td><td class="c">${d.count}</td></tr>`).join('')}
</tbody></table>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) { win.onload = () => { win.print(); URL.revokeObjectURL(url); }; }
  }

  private downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}
