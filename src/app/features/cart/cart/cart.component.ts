import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/core/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router:Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    this.cartService.refreshCart();
  }

  removeItem(productId:number) {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.toastr.success('Item removed'),
      error: (err) => this.toastr.error(err.error?.message || 'Failed to remove item')
    });
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  goToAddress(){
    this.router.navigate(['checkout/address'])
  }
}

