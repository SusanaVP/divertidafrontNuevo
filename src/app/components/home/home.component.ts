import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  idUser: number | null = null;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }


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
  }
}
