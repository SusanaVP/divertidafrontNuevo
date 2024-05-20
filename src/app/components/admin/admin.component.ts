import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../interfaces/blog';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  idUser: number | null = null;
  isAdmin: boolean = false;
  blogEntries: Blog[] | undefined;

  constructor(private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _blogService: BlogService,
  ) { }

  async ngOnInit() {
    //  this.idUser = this._storageService.getUserId();
    // this.isAdmin = this._storageService.isAdmin();
    this.loadBlogNoValidated();

  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  //Blog
  loadBlogNoValidated() {
    this._blogService.getBlogNoValidated().subscribe(blog => {
       this.blogEntries = blog;
    },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
        }
        );
      }
    );
  }

  async editValidation(idBlog: number) {
    await this._blogService.editValidation(idBlog).then(response => {
      this.openSnackBar(response);
      this.openSnackBar('Entrada al blog validada correctamente.');
      this.loadBlogNoValidated();
    })
      .catch(error => {
        console.error(error);
        this.openSnackBar(`Error al validar la entrada al blog.`);
      });
  }
}
