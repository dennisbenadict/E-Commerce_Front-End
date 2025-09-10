import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent {
  name = '';
  phone = '';
  street = '';
  city = '';
  pincode = '';
  state = '';

  constructor(private router: Router) {}

  saveAddress() {
    const address = {
      name: this.name,
      phone: this.phone,
      street: this.street,
      city: this.city,
      pincode: this.pincode,
      state: this.state
    };

    localStorage.setItem('userAddress', JSON.stringify(address));
    this.router.navigate(['/checkout']); // 👈 Go to checkout page
  }
}




