import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/cart.service';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/core/order.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalAmount: number = 0;
  address: any = null;
  paymentMethod: string = 'Credit Card';

  constructor(private cartService: CartService, private router: Router,private orderService:OrdersService,private toastrService:ToastrService) {}

  ngOnInit() {
    const cartItems = this.cartService.getCartItems();
    console.log('Cart items in checkout:', cartItems);
    this.totalAmount = this.cartService.getTotal();
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      this.address = JSON.parse(storedAddress);
    }
  }

  placeOrder() {
    if (!this.paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    const items = this.cartService.getCartItems();
    this.orderService.saveOrder(items);
    this.toastrService.success('Order Placed Successfully')
    this.cartService.clearCart();
    this.router.navigate(['/orders']);
  }
}


