import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h2>Admin Overview</h2>
      <div style="display: flex; gap: 20px; margin-top: 20px;">
        <div style="background: white; padding: 20px; border-radius: 8px; flex: 1;">
          <h3>Total Users</h3>
          <p style="font-size: 2rem;">150</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; flex: 1;">
          <h3>Total Books</h3>
          <p style="font-size: 2rem;">3,400</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}