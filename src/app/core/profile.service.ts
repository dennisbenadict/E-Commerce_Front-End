import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.api}/api/users/profile`);
  }

  updateProfile(payload: any): Observable<any> {
    return this.http.put(`${this.api}/api/users/profile`, payload);
  }

  changePassword(payload: any): Observable<any> {
    return this.http.put(`${this.api}/api/users/profile/change-password`, payload);
  }
}

