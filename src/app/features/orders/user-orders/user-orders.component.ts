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
  loading = false;

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.loading = true;
    this.ordersService.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || res || [];
      },
      error: () => {
        this.toastr.error('Failed to load orders');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  cancelOrder(order: any) {
    const orderId = order.id ?? order.Id;
    if (!orderId) {
      this.toastr.error('Invalid order');
      return;
    }

    if (confirm('Are you sure you want to cancel this order?')) {
      this.ordersService.cancelOrder(orderId).subscribe({
        next: () => {
          this.toastr.success('Order cancelled successfully');
          this.loadOrders();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Failed to cancel order');
        }
      });
    }
  }

  canCancel(order: any): boolean {
    const status = ((order.status ?? order.Status) || '').toLowerCase();
    return status === 'pending' || status === 'processing';
  }
}
