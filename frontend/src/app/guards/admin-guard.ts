import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

const getAdminRedirect = (authService: AuthService, router: Router) => {
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return authService.isStudent()
    ? router.createUrlTree(['/student/dashboard'])
    : router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  return getAdminRedirect(authService, router);
};

export const adminChildGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  return getAdminRedirect(authService, router);
};
