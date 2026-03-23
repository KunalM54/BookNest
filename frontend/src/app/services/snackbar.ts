import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  snackbarComponent: any;

  register(snackbar: any){
    this.snackbarComponent = snackbar;
  }

  show(message:string){
    this.snackbarComponent?.show(message);
  }

}