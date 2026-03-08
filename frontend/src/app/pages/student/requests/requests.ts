import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.html',
  styleUrls: ['./requests.css']
})
export class RequestsStudent {

  requests = [

    {
      book: "Clean Code",
      requestDate: "12 Mar 2026",
      status: "Pending",
      actionDate: "-"
    },

    {
      book: "Introduction to Algorithms",
      requestDate: "10 Mar 2026",
      status: "Approved",
      actionDate: "11 Mar 2026"
    },

    {
      book: "Design Patterns",
      requestDate: "05 Mar 2026",
      status: "Rejected",
      actionDate: "06 Mar 2026"
    }

  ];

}