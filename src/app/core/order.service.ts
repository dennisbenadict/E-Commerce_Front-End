import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(): Observable<any> {
    return this.http.post(`${this.api}/api/orders`, {});
  }

  getMyOrders(): Observable<any> {
    return this.http.get(`${this.api}/api/orders/my`);
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.api}/api/orders`);
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.put(`${this.api}/api/orders/${id}/cancel`, {});
  }

  adminCancelOrder(id: number): Observable<any> {
    return this.http.put(`${this.api}/api/orders/${id}/admin-cancel`, {});
  }
}
