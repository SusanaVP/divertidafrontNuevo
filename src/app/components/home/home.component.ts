import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  idUser: number | null = null;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  email: string = '';

  constructor(private _storageService: StorageService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
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
    this.route.params.subscribe(params => {
      this.isLoggedIn = params['isLoggedIn'];
      this.isAdmin = params['isAdmin'];
    });

    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
      this.email = decode.email;
      this.isLoggedIn = true;
    }
  }
}
