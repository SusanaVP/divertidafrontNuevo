import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  isAdmin: boolean = false;
  idUser: number | null = null;
  isLoggedIn: boolean = false;

  constructor(private _authService: AuthService, private router: Router,   private _storageService: StorageService) { }

  ngOnInit() {
    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      this.isLoggedIn = true;
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
    }
  }
}
