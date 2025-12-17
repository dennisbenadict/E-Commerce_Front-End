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
  addresses: any[] = [];
  selectedAddressId: number | null = null;
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

  ngOnInit() {
    this.loadAddresses();
  }

  private loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        const list = (res.addresses ?? res ?? []) as any[];
        this.addresses = list.map(a => this.mapAddress(a));
      },
      error: () => {
        this.addresses = [];
      }
    });
  }

  private mapAddress(a: any) {
    return {
      id: a.id ?? a.Id,
      fullName: a.fullName ?? a.FullName ?? a.name ?? '',
      phone: a.phone ?? a.Phone ?? '',
      street: a.street ?? a.Street ?? '',
      city: a.city ?? a.City ?? '',
      state: a.state ?? a.State ?? '',
      zipCode: a.zipCode ?? a.ZipCode ?? a.pincode ?? a.Pincode ?? '',
      country: a.country ?? a.Country ?? ''
    };
  }

  useAddress(id: number) {
    localStorage.setItem('selectedAddressId', String(id));
    this.router.navigate(['/checkout']);
  }

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
