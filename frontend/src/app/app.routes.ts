import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './auth/login/login';
import { Register } from './auth/register/register';

// Layouts
import { StudentLayoutComponent } from './core/layout/student-layout/student-layout';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

// Dashboards
import { DashboardComponent as StudentDashboard } from './pages/student/dashboard/dashboard';
import { DashboardComponent as AdminDashboard } from './pages/admin/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  // STUDENT
  {
    path: 'student',
    component: StudentLayoutComponent,
    children: [
      { path: 'dashboard', component: StudentDashboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ADMIN (Add this section)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];