import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private _router: Router) {}
  goToSignIn() {
    this._router.navigate(['/sign-in']);
  }
}
