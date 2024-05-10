import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import * as bcrypt from 'bcryptjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false;


  constructor(private _userService: UserService,
    private _router: Router,
    private _storageService: StorageService,
    private _snackBar: MatSnackBar) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  goToSignIn() {
    this._router.navigate(['/sign-in']);
  }

  async openSignInModal() {
    const idUser = await this._storageService.getUserId('loggedInUser');
    return this._router.navigate(['/sign-in']).then(() => {
      idUser
      window.location.reload();
    });
  }

  async sendLogin() {
    if (!this.email || !this.password) {
      this.openSnackBar('Por favor, complete todos los campos.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(this.email)) {
      this.openSnackBar('El correo electrónico es incorrecto.');
      return;
    }
    try {
      const user = await this._userService.getUserByEmail(this.email);

      if (user && bcrypt.compareSync(this.password, user.password)) {
        this._storageService.setUserId('loggedInUser', user.id);

        this.openSnackBar('Inicio de sesión correcto.');
        this._router.navigate(['/home']).then(() => {
          this.isLoggedIn = true;
        });
      } else {
        this.openSnackBar('Email o contraseña incorrectos.');
      }

    } catch (error) {
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
      this.openSnackBar('Error al iniciar sesión.');
    }
  }
}
