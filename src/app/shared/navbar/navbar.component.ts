import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }

  goToCart(){
    this.router.navigate(['/cart']);
  }

  goToAllProducts(){
    this.router.navigate(['/products']);
  }

  search() {
    const trimmedQuery = this.searchQuery.trim().toLowerCase();
    this.router.navigate(['/products'], { queryParams: { search: trimmedQuery }});
    this.searchQuery = '';
  }
}

