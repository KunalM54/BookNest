import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.html',
  styleUrls: ['./snackbar.css']
})
export class SnackbarComponent {

  constructor(private snackbarService: SnackbarService){}

ngOnInit(){
  this.snackbarService.register(this);
}

  message = '';
  visible = false;

  show(message: string) {
    this.message = message;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 3000);
  }

}