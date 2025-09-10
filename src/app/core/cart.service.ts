import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems.next(JSON.parse(storedCart));
    }
  }

  private updateLocalStorage(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  getCartItems() {
    return this.cartItems.getValue();
  }

  addToCart(product: Product) {
    const items = this.getCartItems();
    const existing = items.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ product, quantity: 1 });
    }

    this.cartItems.next([...items]);
    this.updateLocalStorage(items); // ✅ Save to localStorage
  }

  removeFromCart(id: number) {
    const updated = this.getCartItems().filter(i => i.product.id !== id);
    this.cartItems.next(updated);
    this.updateLocalStorage(updated); // ✅ Save to localStorage
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cart'); // ✅ Clear localStorage
  }

  getTotal() {
    return this.getCartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }
}
