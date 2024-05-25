import { Component } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  userData: User = {
    id: 0,
    name: '',
    lastName: '',
    movil: '',
    email: '',
    password: '',
    date: '',
    postalCode: '',
    admin: false
  };

  password2: string = '';

  constructor(private _userService: UserService,
    private _router: Router,
    private _authService: AuthService,
    private _snackBar: MatSnackBar) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.userData.name || !this.userData.lastName || !this.userData.date ||
      !this.userData.email || !this.userData.password || !this.password2 || !this.userData.movil) {
      this.openSnackBar('Por favor, complete todos los campos.');
      return;
    }

    if (this.userData.name && this.userData.lastName) {
      const lettersWithAccentsRegex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/;

      if (!lettersWithAccentsRegex.test(this.userData.name)) {
        this.openSnackBar('El nombre solo puede contener letras y tildes.');
        return;
      }

      if (!lettersWithAccentsRegex.test(this.userData.lastName)) {
        this.openSnackBar('El apellido solo puede contener letras y tildes.');
        return;
      }
    }

    if (this.userData.password !== this.password2) {
      this.openSnackBar('Las contraseñas no coinciden.');
      return;
    }

    if (this.userData.password.length < 6 || !/[A-Z]/.test(this.userData.password)) {
      this.openSnackBar('La contraseña debe tener al menos 6 caracteres y una letra mayúscula.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(this.userData.email)) {
      this.openSnackBar('El correo electrónico es incorrecto.');
      return;
    }

    if (!/^[0-9]{9}$/.test(this.userData.movil)) {
      this.openSnackBar('El número de teléfono debe tener exactamente 9 dígitos.');
      return;
    }

    const emailExists = await this._userService.getUserByEmail(this.userData.email);

    if (emailExists != null) {
      this.openSnackBar('Este correo electrónico ya está en uso.');
      return;
    } else {

      const result = await this._userService.userDataSave(this.userData);

      if (result === 'success') {
        try {
          const login = await this._authService.login(this.userData.email,this.userData.password);

          if (login !== null || !login) {
            this._router.navigate(['/home']).then(() => {
              window.location.reload();
              this.openSnackBar('Registro exitoso.');
            });
          } else {
            this.openSnackBar('Error al iniciar sesión.');
          }
          // }
        } catch (error) {
          console.log('Error al iniciar sesión:');

        }
      } else {
        console.log('Error al guardar los datos del usuario.');
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
        });
      }
      return;
    }
  }
}
