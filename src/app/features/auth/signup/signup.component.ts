import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  
  constructor(private fb: FormBuilder, private router: Router,private toastr:ToastrService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    const { name, email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.toastr.error("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      this.toastr.error("User already exists. Please login.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      isBlocked: false,
      orders: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    this.router.navigate(['/auth/login']);
  }
}

