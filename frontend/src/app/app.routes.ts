import { Routes } from '@angular/router';

// Public Pages
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './auth/login/login';
import { Register } from './auth/register/register';

// Layouts
import { StudentLayoutComponent } from './core/layout/student-layout/student-layout';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

// ================= STUDENT PAGES =================
import { DashboardComponent as StudentDashboard } from './pages/student/dashboard/dashboard';
import { BrowseBooksComponent } from './pages/student/browse-books/browse-books';
import { MyBooksComponent } from './pages/student/my-books/my-books';
import { HistoryComponent } from './pages/student/history/history';
import { ProfileComponent as StudentProfile } from './pages/student/profile/profile'; // Alias used

// ================= ADMIN PAGES =================
import { DashboardComponent as AdminDashboard } from './pages/admin/dashboard/dashboard';
import { ManageBooksComponent } from './pages/admin/manage-books/manage-books';
import { ManageStudentsComponent } from './pages/admin/manage-students/manage-students';
import { BorrowRequestsComponent } from './pages/admin/borrow-requests/borrow-requests';
import { ReportsComponent } from './pages/admin/reports/reports';
import { NoticesComponent } from './pages/admin/notices/notices';
import { ProfileComponent as AdminProfile } from './pages/admin/profile/profile'; // Alias used
import { ChangePassword } from './pages/admin/change-password/change-password';

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  // STUDENT ROUTING
  {
    path: 'student',
    component: StudentLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboard },
      { path: 'browse', component: BrowseBooksComponent },
      { path: 'my-books', component: MyBooksComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'profile', component: StudentProfile }
    ]
  },

  // ADMIN ROUTING
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'books', component: ManageBooksComponent },
      { path: 'students', component: ManageStudentsComponent },
      { path: 'requests', component: BorrowRequestsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'notices', component: NoticesComponent },
      { path: 'profile', component: AdminProfile },
      { path: 'change-password', component: ChangePassword }
    ]
  }
];