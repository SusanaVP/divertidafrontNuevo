import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    combineLatest([
      this.authService.isLoggedIn,
      this.authService.isAdmin
    ]).pipe(
      map(([loggedIn, isAdmin]) => ({ loggedIn, isAdmin }))
    ).subscribe(({ loggedIn, isAdmin }) => {
      this.isLoggedIn = loggedIn;
      this.isAdmin = isAdmin;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
