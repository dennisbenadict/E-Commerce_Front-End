import { Component,OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/core/order.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  userOrders: any[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: () => this.toastr.error('Failed to load users'),
      complete: () => this.loading = false
    });
  }

  selectUser(user:any) {
    this.selectedUser = user;
    this.userOrders = [];
    this.loadUserOrders(user.id ?? user.Id);
  }

  blockUser(user: any) {
    const action = user.isBlocked ? this.authService.unblockUser(user.id ?? user.Id) : this.authService.blockUser(user.id ?? user.Id);
    action.subscribe({
      next: () => {
        this.toastr.success(user.isBlocked ? 'User unblocked' : 'User blocked');
        this.loadUsers();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Action failed')
    });
  }

  private loadUserOrders(userId: number) {
    this.ordersService.getAllOrders().subscribe({
      next: (res: any) => {
        const list = res.orders ?? res ?? [];
        this.userOrders = (list as any[]).filter(o => (o.userId ?? o.UserId) === userId);
      },
      error: () => {
        this.userOrders = [];
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
      this.ordersService.adminCancelOrder(orderId).subscribe({
        next: () => {
          this.toastr.success('Order cancelled successfully');
          if (this.selectedUser) {
            this.loadUserOrders(this.selectedUser.id ?? this.selectedUser.Id);
          }
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
