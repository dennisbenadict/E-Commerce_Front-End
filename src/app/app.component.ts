import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce';
    showLayout=true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/auth/login','/auth/signup','/admin','/admin/order-list','/admin/product-form','/admin/user-list','/admin/admin-login'];
        this.showLayout = !hiddenRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}
