import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-global-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-search-bar.html',
  styleUrls: ['./global-search-bar.css']
})
export class GlobalSearchBarComponent {
  @Input() placeholder: string = 'Search...';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(newVal: string): void {
    this.value = newVal;
    this.valueChange.emit(this.value);
  }

  clear(): void {
    this.value = '';
    this.valueChange.emit(this.value);
  }
}
