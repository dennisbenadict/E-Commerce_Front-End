import { Injectable } from '@angular/core';
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersKey = 'userOrders';

getOrders(): any[] {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');

  return allOrders[currentUser?.email] || [];
}


saveOrder(items: any[]) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');

  const userEmail = currentUser?.email;
  if (!userEmail) return;

  allOrders[userEmail] = allOrders[userEmail] || [];
  allOrders[userEmail].push(...items);

  localStorage.setItem('orders', JSON.stringify(allOrders));
}


  clearOrders() {
    localStorage.removeItem(this.ordersKey);
  }
}
