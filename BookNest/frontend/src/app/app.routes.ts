import { Routes } from '@angular/router';
import { adminChildGuard, adminGuard } from './guards/admin-guard';
import { authChildGuard, authGuard } from './guards/auth-guard';
import { studentChildGuard, studentGuard } from './guards/student-guard';

// Public Pages
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';

// Layouts
import { StudentLayoutComponent } from './core/layout/student-layout/student-layout';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

// ================= STUDENT PAGES =================
import { DashboardComponent as StudentDashboard } from './pages/student/dashboard/dashboard';
import { BrowseBooksComponent } from './pages/student/browse-books/browse-books';
import { MyBooksComponent } from './pages/student/my-books/my-books';
import { HistoryComponent } from './pages/student/history/history';
import { ProfileComponent as StudentProfile } from './pages/student/profile/profile'; // Alias used
import { NoticesStudent } from './pages/student/notices/notices';
import { RequestsComponent } from './pages/student/requests/requests';
import { ChangePasswordStudent } from './pages/student/change-password/change-password';
import { MyLibraryComponent } from './pages/student/my-library/my-library';


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
  { path: 'forgot-password', component: ForgotPassword },

  // STUDENT ROUTING
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [authGuard, studentGuard],
    canActivateChild: [authChildGuard, studentChildGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboard },
      { path: 'browse', component: BrowseBooksComponent },
      { path: 'my-books', component: MyBooksComponent },
      { path: 'my-library', component: MyLibraryComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'profile', component: StudentProfile },
      { path: 'change-password', component: ChangePasswordStudent },
      { path: 'notices', component: NoticesStudent },
      { path: 'requests', component: RequestsComponent }
    ]
  },

  // ADMIN ROUTING
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    canActivateChild: [authChildGuard, adminChildGuard],
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
