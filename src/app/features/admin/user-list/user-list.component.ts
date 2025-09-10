import { Component,OnInit} from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
users: any[] = [];
userOrders: any[] = [];
selectedUser: any = null;

ngOnInit() {
    const usersFromStorage = localStorage.getItem('users');
    this.users = usersFromStorage ? JSON.parse(usersFromStorage) : [];
  }

selectUser(user:any) {
  this.selectedUser = user;

  const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');
  this.userOrders = allOrders[user.email] || [];
  console.log('User Orders (from selectUser):', this.userOrders);
}

blockUser(user: any) {
    user.isBlocked = !user.isBlocked;
    localStorage.setItem('users', JSON.stringify(this.users));
  }

viewUser(user: any) {
  this.selectedUser = user;

  const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');
  const userEmail = user.email;

  this.userOrders = allOrders[userEmail] || [];
  console.log('User Orders (from viewUser):', this.userOrders);
}

}
