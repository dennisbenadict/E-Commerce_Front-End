import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/core/profile.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private router:Router,
    private profileService: ProfileService,
    private toastr: ToastrService
  ){}

  ngOnInit() {
    this.loadProfile();
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
}
