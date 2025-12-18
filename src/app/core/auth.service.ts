import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  message?: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = environment.apiUrl;
  private isRefreshing = false;
  private refreshTokenSubject: any = null;

  constructor(private http: HttpClient) {
    // Clear any old localStorage tokens (migration from localStorage to cookies)
    this.clearOldTokens();
  }

  private clearOldTokens(): void {
    // Remove any old token storage from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/api/auth/register`, payload, {
      withCredentials: true
    });
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/api/auth/login`, payload, {
      withCredentials: true
    });
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.api}/api/auth/refresh`, {}, {
      withCredentials: true
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.api}/api/auth/users`, {
      withCredentials: true
    });
  }

  blockUser(userId: number): Observable<any> {
    return this.http.post(`${this.api}/api/auth/block/${userId}`, {}, {
      withCredentials: true
    });
  }

  unblockUser(userId: number): Observable<any> {
    return this.http.post(`${this.api}/api/auth/unblock/${userId}`, {}, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.api}/api/auth/logout`, {}, {
      withCredentials: true
    });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.api}/api/auth/me`, {
      withCredentials: true
    });
  }

  isAuthenticated(): boolean {
    // Since we're using HTTP-only cookies, we can't check localStorage
    // We'll rely on API calls to determine authentication status
    // This is a simple check - in production, you might want to call /api/auth/me
    return true; // Will be determined by API responses
  }

  getUserRole(): string | null {
    // Since token is in HTTP-only cookie, we can't decode it in frontend
    // Role will be determined from API responses
    return null;
  }
}
