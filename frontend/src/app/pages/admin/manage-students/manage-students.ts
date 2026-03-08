import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-students.html',
  styleUrls: ['./manage-students.css']
})
export class ManageStudentsComponent {

  searchTerm = '';
  statusFilter = 'all';

  students = [
    { name: 'Mike Ross', email: 'mike@example.com', borrowedCount: 2, active: true },
    { name: 'Rachel Zane', email: 'rachel@example.com', borrowedCount: 0, active: true },
    { name: 'Louis Litt', email: 'louis@example.com', borrowedCount: 5, active: false }
  ];

  get filteredStudents() {

    let data = this.students.filter(student =>
      student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.statusFilter === 'active') {
      data = data.filter(s => s.active);
    }

    if (this.statusFilter === 'blocked') {
      data = data.filter(s => !s.active);
    }

    return data;

  }

  sortByName(event: any) {

    const value = event.target.value;

    if (value === 'asc') {
      this.students.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (value === 'desc') {
      this.students.sort((a, b) => b.name.localeCompare(a.name));
    }

  }

  sortByBorrow(event: any) {

    const value = event.target.value;

    if (value === 'asc') {
      this.students.sort((a, b) => a.borrowedCount - b.borrowedCount);
    }

    if (value === 'desc') {
      this.students.sort((a, b) => b.borrowedCount - a.borrowedCount);
    }

  }

  filterStatus(event: any) {
    this.statusFilter = event.target.value;
  }

  blockStudent(student: any) {
    student.active = false;
  }

  activateStudent(student: any) {
    student.active = true;
  }

  viewStudent(student: any) {
    console.log(student);
  }

}