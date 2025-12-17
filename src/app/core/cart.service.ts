import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrls: string[];
}

export interface CartResponse {
  items: CartItem[];
  totalAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart() {
    this.http.get<CartResponse>(`${this.api}/api/cart`).subscribe({
      next: (res) => {
        this.cartItems.next(res.items ?? []);
      },
      error: () => {
        this.cartItems.next([]);
      }
    });
  }

  getCartItems() {
    return this.cartItems.getValue();
  }

  addToCart(productId: number, quantity: number = 1) {
    return this.http.post<CartResponse>(`${this.api}/api/cart/add`, { productId, quantity })
      .pipe(
        tap(res => this.cartItems.next(res.items ?? []))
      );
  }

  removeFromCart(productId: number) {
    return this.http.request<CartResponse>('delete', `${this.api}/api/cart/remove`, { body: { productId } })
      .pipe(
        tap(res => this.cartItems.next(res.items ?? []))
      );
  }

  clearCart() {
    this.cartItems.next([]);
  }

  refreshCart() {
    this.loadCart();
  }

  getTotal() {
    return this.getCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
