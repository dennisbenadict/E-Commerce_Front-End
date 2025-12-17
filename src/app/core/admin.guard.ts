import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/admin/admin-login']);
    return false;
  }

  const role = authService.getUserRole();
  if (role === 'Admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
