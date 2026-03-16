import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  label: string;
  value: string;
  count?: number;
}

@Component({
  selector: 'app-tabs-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-filter.html',
  styleUrl: './tabs-filter.css'
})
export class TabsFilterComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab: string = 'all';
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(tabValue: string): void {
    this.activeTab = tabValue;
    this.tabChange.emit(tabValue);
  }
}
