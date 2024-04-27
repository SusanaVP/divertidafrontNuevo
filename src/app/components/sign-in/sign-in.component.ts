import { Component } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

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
    postalCode:'',
    admin: false
  };

  password2: string = '';

  constructor(private _userService: UserService,
    private _router: Router,
    private _storageService: StorageService) { }


  async onSubmit(): Promise<void> {
    if (!this.userData.name || !this.userData.lastName || !this.userData.date ||
      !this.userData.email || !this.userData.password || !this.password2 || !this.userData.movil) {
      console.log('Por favor, complete todos los campos.');
      return;
    }

    if (this.userData.name && this.userData.lastName) {
      const lettersWithAccentsRegex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/;

      if (!lettersWithAccentsRegex.test(this.userData.name)) {
        console.log('El nombre solo puede contener letras y tildes.');
        return;
      }

      if (!lettersWithAccentsRegex.test(this.userData.lastName)) {
        console.log('El apellido solo puede contener letras y tildes.');
        return;
      }
    }

    if (this.userData.password !== this.password2) {
      console.log('Las contraseñas no coinciden.');
      return;
    }

    if (this.userData.password.length < 6 || !/[A-Z]/.test(this.userData.password)) {
      console.log('La contraseña debe tener al menos 6 caracteres y una letra mayúscula.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(this.userData.email)) {
      console.log('El correo electrónico es incorrecto.');
      return;
    }

    if (!/^[0-9]{9}$/.test(this.userData.movil)) {
      console.log('El número de teléfono debe tener exactamente 9 dígitos.');
      return;
    }

    const emailExists = await this._userService.getUserByEmail(this.userData.email);

    if (emailExists != null) {
      console.log('Este correo electrónico ya está en uso.');
      return;
    } else {

      // const salt = bcrypt.genSaltSync(10);
      // const hashedPassword = bcrypt.hashSync(this.userData.password, salt);
      // this.userData.password = hashedPassword;

      const result = await this._userService.userDataSave(this.userData);

      if (result === 'success') {
        try {
          const user: User | undefined = await this._userService.getUserByEmail(this.userData.email);

          if (user != undefined) {
            await this._storageService.setUserId('loggedInUser', user.id);
       
            this._router.navigate(['/home']).then(() => {
              window.location.reload();
              console.log('Registro exitoso.');
            });
          }
        } catch (error) {
          console.log('Error al iniciar sesión:');
        }
      } else {
        console.log('Error al guardar los datos del usuario.');
      }
      return;
    }
  }
}
