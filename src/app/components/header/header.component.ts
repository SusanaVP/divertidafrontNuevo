import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  idUser: number | null = null;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  email: string = '';

  constructor(private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _userService: UserService) { }


  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async ngOnInit() {
    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
      this.email = decode.email;
      this.isLoggedIn = true;
    }
  }

  navigateToLogin() {
    return this._router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  async logout() {
    try {
      await this._storageService.removeUser();
      this.isLoggedIn = false;
      return this._router.navigate(['/home']).then(() => {
        window.location.reload();
      })
      
    } catch (error) {
      return this._router.navigate(['/error']).then(() => {
        window.location.reload();
        this.openSnackBar('Error al intentar cerrar sesión:');
      });
    }
  }
}
