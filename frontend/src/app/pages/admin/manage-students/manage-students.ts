import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Student } from '../../../services/user';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-students.html',
  styleUrls: ['./manage-students.css']
})
export class ManageStudentsComponent implements OnInit {

  searchTerm = '';
  statusFilter = 'all';
  students: Student[] = [];
  isLoading = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.userService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data.map((student: Student) => ({
          ...student,
          borrowedCount: 0
        }));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading students:', error);
        this.isLoading = false;
      }
    });
  }

  get filteredStudents() {
    let data = this.students.filter(student =>
      student.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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
      this.students.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }

    if (value === 'desc') {
      this.students.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }
  }

  sortByBorrow(event: any) {
    const value = event.target.value;

    if (value === 'asc') {
      this.students.sort((a, b) => (a.borrowedCount || 0) - (b.borrowedCount || 0));
    }

    if (value === 'desc') {
      this.students.sort((a, b) => (b.borrowedCount || 0) - (a.borrowedCount || 0));
    }
  }

  filterStatus(event: any) {
    this.statusFilter = event.target.value;
  }

  blockStudent(student: Student) {
    this.userService.blockStudent(student.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          student.active = false;
        }
      },
      error: (error: any) => {
        console.error('Error blocking student:', error);
      }
    });
  }

  activateStudent(student: Student) {
    this.userService.activateStudent(student.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          student.active = true;
        }
      },
      error: (error: any) => {
        console.error('Error activating student:', error);
      }
    });
  }

  viewStudent(student: Student) {
    console.log(student);
  }
}
