import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<any> {
    return this.http.get(`${this.api}/api/users/addresses`);
  }

  createAddress(payload: any): Observable<any> {
    return this.http.post(`${this.api}/api/users/addresses`, payload);
  }

  updateAddress(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.api}/api/users/addresses/${id}`, payload);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.api}/api/users/addresses/${id}`);
  }
}

