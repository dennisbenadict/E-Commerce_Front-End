import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Call API to check if user is admin
  // Since token is in HTTP-only cookie, we need to verify via API
  return authService.getCurrentUser().pipe(
    map((user: any) => {
      const role = user?.role || user?.Role;
      if (role === 'Admin') {
        return true;
      }
      router.navigate(['/admin/admin-login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/admin/admin-login']);
      return of(false);
    })
  );
};
