import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

const buildLoginRedirect = (router: Router, url: string) =>
  router.createUrlTree(['/login'], {
    queryParams: { redirect: url }
  });

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return buildLoginRedirect(router, state.url);
};

export const authChildGuard: CanActivateChildFn = (_childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return buildLoginRedirect(router, state.url);
};
