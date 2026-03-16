import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBarComponent {
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
