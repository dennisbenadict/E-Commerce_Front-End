import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/cart.service';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/core/order.service';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from 'src/app/core/address.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalAmount: number = 0;
  address: any = null;
  paymentMethod: string = 'Credit Card';

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService:OrdersService,
    private toastrService:ToastrService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    });
    this.loadAddress();
  }

  private loadAddress() {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        const addresses = res.addresses || res;
        this.address = addresses && addresses.length ? addresses[0] : null;
      },
      error: () => {
        this.address = null;
      }
    });
  }

  placeOrder() {
    if (!this.paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    this.orderService.createOrder().subscribe({
      next: () => {
        this.toastrService.success('Order Placed Successfully');
        this.cartService.clearCart();
        this.cartService.refreshCart();
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.toastrService.error(err.error?.message || 'Failed to place order');
      }
    });
  }
}
