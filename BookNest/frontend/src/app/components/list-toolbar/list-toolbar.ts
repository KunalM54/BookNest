import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalSearchBarComponent } from '../global-search-bar/global-search-bar';
import { SortDropdownComponent, SortOption } from '../sort-dropdown/sort-dropdown';

@Component({
  selector: 'app-list-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalSearchBarComponent, SortDropdownComponent],
  templateUrl: './list-toolbar.html',
  styleUrl: './list-toolbar.css'
})
export class ListToolbarComponent {
  @Input() searchPlaceholder: string = 'Search...';
  @Input() searchTerm: string = '';
  @Input() sortBy: string = 'newest';
  @Input() sortOptions: SortOption[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' }
  ];
  @Input() showSort: boolean = true;

  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChange.emit(term);
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
    this.sortChange.emit(sort);
  }
}
