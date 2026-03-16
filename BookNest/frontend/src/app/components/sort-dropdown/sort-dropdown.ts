import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SortOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-sort-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-dropdown.html',
  styleUrl: './sort-dropdown.css'
})
export class SortDropdownComponent {
  @Input() sortBy: string = 'newest';
  @Input() options: SortOption[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' }
  ];
  @Input() label: string = 'Sort by:';
  @Output() sortChange = new EventEmitter<string>();

  onSortChange(): void {
    this.sortChange.emit(this.sortBy);
  }
}
