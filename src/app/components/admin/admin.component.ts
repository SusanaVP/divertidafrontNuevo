import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../interfaces/blog';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  idUser: number | null = null;
  isAdmin: boolean = false;
  blogEntries: Blog[] | undefined;
  
  constructor(private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar) { }

  async ngOnInit() {
  //  this.idUser = this._storageService.getUserId();
   // this.isAdmin = this._storageService.isAdmin();
  }



}
