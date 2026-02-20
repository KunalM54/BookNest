import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Required for navigation
  templateUrl: './student-layout.html',
  styleUrls: ['./student-layout.css']
})
export class StudentLayoutComponent {
  // We will add real logout logic later
  logout() {
    console.log("Logging out...");
  }
}