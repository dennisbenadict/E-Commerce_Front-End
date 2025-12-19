import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  login() {
    if (this.loading) return;
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Call /api/auth/me to get user role (since token is in HTTP-only cookie)
        this.authService.getCurrentUser().subscribe({
          next: (user: any) => {
            const role = user?.role || user?.Role;
            if (role === 'Admin') {
              this.toastr.success('Welcome, Admin');
              this.router.navigate(['/admin']);
            } else {
              this.errorMessage = 'Access denied. Admins only.';
              this.toastr.error(this.errorMessage);
              this.loading = false;
            }
          },
          error: () => {
            this.errorMessage = 'Failed to verify user role';
            this.toastr.error(this.errorMessage);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid credentials';
        this.toastr.error(this.errorMessage);
        this.loading = false;
      }
    });
  }
}
