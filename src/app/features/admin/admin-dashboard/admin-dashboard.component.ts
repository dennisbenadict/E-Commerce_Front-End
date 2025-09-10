import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
 sidebarExpanded: boolean = false;
  constructor(private router:Router){}
  goToProducts(){
    this.router.navigate(['/admin/product-form'])
  }
    goToUsers(){
    this.router.navigate(['/admin/user-list'])
  }
}


