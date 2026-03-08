import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notices.html',
  styleUrls: ['./notices.css']
})
export class NoticesStudent {

  notices = [
    {
      title: "Library Closed on Sunday",
      message: "The library will remain closed this Sunday due to maintenance work.",
      date: "12 Mar 2026",
      important: true
    },
    {
      title: "New Books Added",
      message: "Over 50 new books have been added to the Technology and Fiction sections.",
      date: "10 Mar 2026",
      important: false
    },
    {
      title: "Borrow Limit Updated",
      message: "Students can now borrow up to 3 books at a time.",
      date: "05 Mar 2026",
      important: false
    }
  ];

}