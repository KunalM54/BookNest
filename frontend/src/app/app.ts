import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { SnackbarComponent } from './components/snackbar/snackbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnackbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private router: Router,
    private titleService: Title
  ) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null)
      )
      .subscribe(() => this.updatePageTitle(this.router.url));
  }

  private updatePageTitle(url: string): void {
    if (url.startsWith('/admin')) {
      this.titleService.setTitle('BookNest | Admin');
      return;
    }

    if (url.startsWith('/student')) {
      this.titleService.setTitle('BookNest | User');
      return;
    }

    this.titleService.setTitle('BookNest');
  }
}
