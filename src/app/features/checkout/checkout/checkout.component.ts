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
  addresses: any[] = [];
  selectedAddressId: number | null = null;
  paymentMethod: string = 'Credit Card';

  constructor(
    private cartService: CartService,
    public router: Router,
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
        const list = (res.addresses ?? res ?? []) as any[];
        this.addresses = list.map(a => this.mapAddress(a));
        const stored = localStorage.getItem('selectedAddressId');
        const storedId = stored ? Number(stored) : null;
        if (this.addresses.length) {
          this.selectedAddressId = this.addresses.some(a => a.id === storedId)
            ? storedId
            : this.addresses[0].id;
        }
      },
      error: () => {
        this.addresses = [];
        this.selectedAddressId = null;
      }
    });
  }

  get selectedAddress() {
    return this.addresses.find(a => a.id === this.selectedAddressId) || null;
  }

  private mapAddress(a: any) {
    return {
      id: a.id ?? a.Id,
      name: a.fullName ?? a.FullName ?? a.name ?? '',
      phone: a.phone ?? a.Phone ?? '',
      street: a.street ?? a.Street ?? '',
      city: a.city ?? a.City ?? '',
      state: a.state ?? a.State ?? '',
      pincode: a.zipCode ?? a.ZipCode ?? a.pincode ?? a.Pincode ?? '',
      country: a.country ?? a.Country ?? ''
    };
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
