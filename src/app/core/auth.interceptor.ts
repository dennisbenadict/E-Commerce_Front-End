import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Clone request with credentials to send cookies (required for HTTP-only cookies)
    const clonedRequest = request.clone({
      withCredentials: true
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized - try to refresh token
        if (error.status === 401 && !clonedRequest.url.includes('/api/auth/refresh') && !clonedRequest.url.includes('/api/auth/login') && !clonedRequest.url.includes('/api/auth/register')) {
          return this.handle401Error(clonedRequest, next);
        }
        
        // If refresh fails or other error, redirect to login
        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
        }
        
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next('success');
          
          // Retry the original request (cookies are automatically sent)
          return next.handle(request);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          this.router.navigate(['/auth/login']);
          return throwError(() => err);
        })
      );
    } else {
      // If already refreshing, wait for the refresh to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(request))
      );
    }
  }
}
