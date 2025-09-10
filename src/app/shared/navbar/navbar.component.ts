import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PRODUCTS } from '../data/product';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  searchQuery: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }

  goToProfile(){
    this.router.navigate(['/profile'])
  }

  goToCart(){
    this.router.navigate(['/cart'])
  }

  goToAllProducts(){
    this.router.navigate(['/products'])
  }

  search() {
    const trimmedQuery = this.searchQuery.trim().toLowerCase();

    const foundProduct = PRODUCTS.find(p =>
      p.name.toLowerCase().includes(trimmedQuery)
    );

    if (foundProduct) {
      this.router.navigate(['/products', foundProduct.id]);
    } else {
      alert('Product not found');
    }
    this.searchQuery = '';
  }
}

