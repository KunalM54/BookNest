import { CanActivateFn } from '@angular/router';

export const studentGuard: CanActivateFn = (route, state) => {
  return true;
};
