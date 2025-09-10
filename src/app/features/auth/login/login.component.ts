import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,private router:Router,private toastr:ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
onSubmit() {
  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    this.toastr.success('Invalid email or password', 'Login Failed');
    return;
  }

  if (user.isBlocked) {
    this.toastr.warning('You are blocked by the admin', 'Access Denied');
    return;
  }

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', JSON.stringify(user));
  this.toastr.success('Login successful!', 'Welcome');
  this.router.navigate(['/']);
}

}
