import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  userId: number | null = null;
  isLoggedIn: boolean = false;

  constructor(private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar) { }


  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async ngOnInit() {
    this.userId = await this.loggedUser();
    if (this.userId !== 0 && this.userId !== null) {
      this.isLoggedIn = true;
    }
  }

  async loggedUser() {
    return this._storageService.getUserId('loggedInUser');
  }

  navigateToLogin() {
    return this._router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  async logout() {
    try {
      await this._storageService.removeUserId('loggedInUser');
      this.userId = null;
      this.isLoggedIn = false;
      window.location.reload();
    } catch (error) {
      return this._router.navigate(['/error']).then(() => {
        window.location.reload();
        this.openSnackBar('Error al intentar cerrar sesión:');
      });
    }
  }
}
