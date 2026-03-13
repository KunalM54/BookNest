import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  const skipLogout = request.url.includes('/api/reports');

  if (!token || request.headers.has('Authorization')) {
    return next(request).pipe(
      catchError((err) => {
        if (!skipLogout && (err?.status === 401 || err?.status === 403)) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  ).pipe(
    catchError((err) => {
      if (!skipLogout && (err?.status === 401 || err?.status === 403)) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
