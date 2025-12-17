import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.ordersService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders ?? res ?? [];
      },
      error: () => this.toastr.error('Failed to load orders'),
      complete: () => this.loading = false
    });
  }

  cancelOrder(orderId: number) {
    this.ordersService.adminCancelOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Order cancelled');
        this.loadOrders();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Cancel failed')
    });
  }
}

