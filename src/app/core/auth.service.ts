import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  accessToken: string;
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
  private readonly tokenKey = 'accessToken';
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/api/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/api/auth/login`, payload)
      .pipe(
        tap(res => {
          if (res.accessToken) {
            this.storeToken(res.accessToken);
          }
        })
      );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.api}/api/auth/users`);
  }

  blockUser(userId: number): Observable<any> {
    return this.http.post(`${this.api}/api/auth/block/${userId}`, {});
  }

  unblockUser(userId: number): Observable<any> {
    return this.http.post(`${this.api}/api/auth/unblock/${userId}`, {});
  }

  logout(): Observable<any> {
    localStorage.removeItem(this.tokenKey);
    return this.http.post(`${this.api}/api/auth/logout`, {});
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.api}/api/auth/me`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch {
      return null;
    }
  }

  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
