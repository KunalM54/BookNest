import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-students.html',
  styleUrls: ['./manage-students.css']
})
export class ManageStudentsComponent {
  students = [
    { name: 'Mike Ross', email: 'mike@example.com', borrowedCount: 2, active: true },
    { name: 'Rachel Zane', email: 'rachel@example.com', borrowedCount: 0, active: true },
    { name: 'Louis Litt', email: 'louis@example.com', borrowedCount: 5, active: false }, // Blocked
  ];
}