import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from 'src/app/core/address.service';
import { ToastrService } from 'ngx-toastr';

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
  saving = false;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private toastr: ToastrService
  ) {}

  saveAddress() {
    if (this.saving) return;
    this.saving = true;

    const address = {
      fullName: this.name,
      phone: this.phone,
      street: this.street,
      city: this.city,
      zipCode: this.pincode,
      state: this.state,
      country: 'India'
    };

    this.addressService.createAddress({
      FullName: address.fullName,
      Phone: address.phone,
      Street: address.street,
      City: address.city,
      ZipCode: address.zipCode,
      State: address.state,
      Country: address.country
    }).subscribe({
      next: () => {
        this.toastr.success('Address saved');
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to save address');
        this.saving = false;
      },
      complete: () => this.saving = false
    });
  }
}
