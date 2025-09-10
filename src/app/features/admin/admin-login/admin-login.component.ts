import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  login() {
    const hardcodedEmail = 'admin1@gmail.com';
    const hardcodedPassword = '12345';

    if (this.email === hardcodedEmail && this.password === hardcodedPassword) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Invalid Admin Credentials';
    }
  }
}
