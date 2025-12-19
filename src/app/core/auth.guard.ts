import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Since tokens are in HTTP-only cookies, we can't check them directly
  // The interceptor will handle 401 errors and redirect to login
  // For now, allow access and let the API/interceptor handle authentication
  return true;
};
