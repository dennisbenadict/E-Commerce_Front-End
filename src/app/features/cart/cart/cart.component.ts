import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/core/cart.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService,private router:Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {this.cartItems = items;
      console.log('Cart items:', items);
    });
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  goToAddress(){
    this.router.navigate(['checkout/address'])
  }
}

