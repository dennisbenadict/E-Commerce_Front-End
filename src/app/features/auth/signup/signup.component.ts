import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr:ToastrService,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid || this.loading) return;

    const { name, email, phone, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.toastr.error("Passwords do not match");
      return;
    }

    this.loading = true;

    this.authService.register({ name, email, phone, password }).subscribe({
      next: () => {
        this.toastr.success('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
        this.toastr.error(this.errorMessage);
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}

