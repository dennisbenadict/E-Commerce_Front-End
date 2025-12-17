import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/core/profile.service';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from 'src/app/core/address.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = false;
  savingProfile = false;
  changingPassword = false;

  profileForm = {
    name: '',
    email: '',
    phone: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  addresses: any[] = [];
  addressForm = {
    id: null as number | null,
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  };
  savingAddress = false;
  selectedAddressId: number | null = null;

  constructor(
    private router:Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private addressService: AddressService
  ){}

  ngOnInit() {
    this.loadProfile();
    this.loadAddresses();
  }

  private loadProfile() {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = {
          id: res.id ?? res.Id,
          name: res.name ?? res.Name,
          email: res.email ?? res.Email,
          phone: res.phone ?? res.Phone,
          createdAt: res.createdAt ?? res.CreatedAt
        };
        this.profileForm = {
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone
        };
      },
      error: () => {
        this.toastr.error('Failed to load profile');
      },
      complete: () => this.loading = false
    });
  }

  goToOrders(){
    this.router.navigate(['/orders']);
  }

  updateProfile() {
    if (this.savingProfile) return;
    this.savingProfile = true;
    const payload = {
      name: this.profileForm.name,
      email: this.profileForm.email,
      phone: this.profileForm.phone
    };
    this.profileService.updateProfile(payload).subscribe({
      next: () => {
        this.toastr.success('Profile updated');
        this.loadProfile();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Profile update failed');
      },
      complete: () => this.savingProfile = false
    });
  }

  changePassword() {
    if (this.changingPassword) return;
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }
    this.changingPassword = true;
    const payload = {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    };
    this.profileService.changePassword(payload).subscribe({
      next: () => {
        this.toastr.success('Password changed');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Password change failed');
      },
      complete: () => this.changingPassword = false
    });
  }

  private loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        const list = (res.addresses ?? res ?? []) as any[];
        this.addresses = list.map(a => this.mapAddress(a));
        if (this.addresses.length) {
          this.selectedAddressId = this.addresses[0].id;
        } else {
          this.selectedAddressId = null;
        }
      },
      error: () => {
        this.addresses = [];
        this.selectedAddressId = null;
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

  editAddress(addr: any) {
    this.addressForm = { ...addr };
  }

  resetAddressForm() {
    this.addressForm = {
      id: null,
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    };
  }

  saveAddress() {
    if (this.savingAddress) return;
    if (!this.addressForm.fullName || !this.addressForm.street || !this.addressForm.city) {
      this.toastr.error('Name, street, city are required');
      return;
    }
    this.savingAddress = true;
    const payload = {
      FullName: this.addressForm.fullName,
      Phone: this.addressForm.phone,
      Street: this.addressForm.street,
      City: this.addressForm.city,
      State: this.addressForm.state,
      ZipCode: this.addressForm.zipCode,
      Country: this.addressForm.country
    };

    const req = this.addressForm.id
      ? this.addressService.updateAddress(this.addressForm.id, payload)
      : this.addressService.createAddress(payload);

    req.subscribe({
      next: () => {
        this.toastr.success('Address saved');
        this.resetAddressForm();
        this.loadAddresses();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Address save failed');
      },
      complete: () => this.savingAddress = false
    });
  }

  deleteAddress(id: number) {
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.toastr.success('Address deleted');
        this.loadAddresses();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Delete failed');
      }
    });
  }
}
