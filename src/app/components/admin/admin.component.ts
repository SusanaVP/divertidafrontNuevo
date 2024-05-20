import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../interfaces/blog';
import { BlogService } from '../../services/blog.service';
import { HttpHeaders } from '@angular/common/http';

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

  async deleteBlog(idBlog: number) {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta entrada del blog?');
    if (confirmDelete) {
      try {
        const response: string = await this._blogService.deleteBlog(idBlog);
        if (response === 'success') {
          this.openSnackBar('Entrada del blog eliminada correctamente');
          this.loadBlogNoValidated();
        } else {
          this.openSnackBar('Error al eliminar la entrada del blog');
        }
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        this.openSnackBar('Error al eliminar la entrada del blog. Por favor, inténtelo de nuevo más tarde.');
      }
    } else {
      return;
    }
  }
}
