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
        const url = event.urlAfterRedirects;
        const hideForAuth = url.startsWith('/auth/login') || url.startsWith('/auth/signup');
        const hideForAdmin = url.startsWith('/admin');
        this.showLayout = !(hideForAuth || hideForAdmin);
      }
    });
  }
}
