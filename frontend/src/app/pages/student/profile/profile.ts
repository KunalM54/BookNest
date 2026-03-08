import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {

  constructor(private snackbar: SnackbarService){}

  student = {
    name: 'John Doe',
    id: 'S10239',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    department: 'Computer Science & Engineering',
    borrowed: 2,
    read: 14
  };

  get initials(){
    return this.student.name
      .split(' ')
      .map(n => n[0])
      .join('');
  }

  updateProfile(){
    this.snackbar.show("Profile updated successfully");
  }

}