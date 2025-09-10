import { Component,OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/order.service';
import { CartItem } from 'src/app/core/cart.service';
@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders: CartItem[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.orders = this.ordersService.getOrders();
  }
}
