import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  idUser: number | null = null;
  isAdmin: boolean = false;

  constructor(private _userService: UserService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,) { }

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
    return this._router.navigate(['/sign-in']).then(() => {
      this.idUser
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
      if (!user?.emailValidated) {
        this.openSnackBar('Cuenta no confirmada, por favor confirme el en el correo electrónico antes de loguearse.');
        return;
      } else {
        const token = await this._authService.login(this.email, this.password);
        if (token.email !== null && token.email !== undefined) {
          this.isLoggedIn = true;
          this.isAdmin = token.isAdmin;
          this.openSnackBar('Inicio de sesión correcto.');
          this._router.navigate(['/home', { isLoggedIn: this.isLoggedIn, isAdmin: this.isAdmin, }]).then(() => {
            window.location.reload();
          });
        } else {
          this.openSnackBar('Email o contraseña incorrectos.');
        }
      }
    } catch (error) {
      this.openSnackBar('Email o contraseña incorrectos.');
    }
  }
}
