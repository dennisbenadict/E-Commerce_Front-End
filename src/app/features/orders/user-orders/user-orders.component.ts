import { Component,OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.ordersService.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || res || [];
      },
      error: () => {
        this.toastr.error('Failed to load orders');
      }
    });
  }
}
