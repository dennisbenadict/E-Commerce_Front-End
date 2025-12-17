import { Component,OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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
}
