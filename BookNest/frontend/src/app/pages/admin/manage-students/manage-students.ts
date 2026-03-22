import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService, Student } from '../../../services/user';
import { GlobalSearchBarComponent } from '../../../components/global-search-bar/global-search-bar';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalSearchBarComponent],
  templateUrl: './manage-students.html',
  styleUrls: ['./manage-students.css']
})
export class ManageStudentsComponent implements OnInit {

  searchTerm = '';
  selectedStatus = 'all';
  statusFilter = 'all';
  students: Student[] = [];
  filteredStudents: Student[] = [];
  paginatedStudents: Student[] = [];
  isLoading = false;
  
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.userService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading students:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
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

    this.filteredStudents = data;
    this.updatePagination();
  }

  updatePagination() {
    const total = this.filteredStudents.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedStudents = this.filteredStudents.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.updatePagination();
  }

  goToPreviousPage() { this.goToPage(this.currentPage - 1); }
  goToNextPage() { this.goToPage(this.currentPage + 1); }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1, total);
    } else if (current >= total - 3) {
      pages.push(1, -1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1, -1, current - 1, current, current + 1, -2, total);
    }
    return pages;
  }

  get paginationStart(): number {
    return this.filteredStudents.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredStudents.length);
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
    this.applyFilters();
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
