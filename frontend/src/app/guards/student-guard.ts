import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

const getStudentRedirect = (authService: AuthService, router: Router) => {
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return authService.isAdmin()
    ? router.createUrlTree(['/admin/dashboard'])
    : router.createUrlTree(['/login']);
};

export const studentGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isStudent()) {
    return true;
  }

  return getStudentRedirect(authService, router);
};

export const studentChildGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isStudent()) {
    return true;
  }

  return getStudentRedirect(authService, router);
};
