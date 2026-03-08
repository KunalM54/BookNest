import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent {

  totalBooks = 1240;
  booksIssued = 85;
  overdueBooks = 12;
  activeStudents = 340;

  getBarColor(value: number) {

    if (value <= 30) {
      return '#93c5fd'; // light
    }

    if (value <= 60) {
      return '#3b82f6'; // medium
    }

    return '#1d4ed8'; // dark

  }

  categoryStats = [
    { name: 'Computer Science', count: 45 },
    { name: 'Fiction', count: 25 },
    { name: 'History', count: 15 },
    { name: 'Science', count: 70 },
    { name: 'Others', count: 5 }
  ];

  activities = [
    { user: 'John Doe', action: 'borrowed', book: 'Clean Code', time: '2 mins ago' },
    { user: 'Jane Smith', action: 'returned', book: 'The Great Gatsby', time: '1 hour ago' },
    { user: 'Admin', action: 'added new book', book: 'Angular Design Patterns', time: '3 hours ago' },
    { user: 'Mike Ross', action: 'requested', book: 'Data Structures', time: '5 hours ago' }
  ];

  downloadReport() {
    console.log("Generating report...");
    setTimeout(() => {
      console.log("Report downloaded");
    }, 1000);
  }

}