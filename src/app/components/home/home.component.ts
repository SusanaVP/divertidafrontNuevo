import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  idUser: number | null = null;
  isAdmin: boolean = false;

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
 //   this.idUser = this._storageService.getUserId();
   // this.isAdmin = this._storageService.isAdmin();
  }
}
