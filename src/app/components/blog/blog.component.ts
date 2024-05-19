import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { StorageService } from '../../services/storage.service';
import { Blog } from '../interfaces/blog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogEntries: Blog[] | undefined;
  loading: boolean = true;
  entry: number = 0;
  likesCont: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;

  constructor(private _blogService: BlogService,
    private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  ngOnInit() {
    this.loading = true;
  //  this.idUser = this._storageService.getUserId();
    //this.isAdmin = this._storageService.isAdmin();

    this._blogService.getBlogValidated().subscribe(entries => {
      this.blogEntries = entries;
      this.loading = false;
    },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
          this.loading = true;
        }
        );
      }
    );
  }

  async openBlogEntryForm() {
    if (this.idUser  !== null && this.idUser  !== undefined) {

      return this._router.navigate(['/blog-entry-form', { idUser : this.idUser  }]);

    } else {
      return this.openSnackBar('Tienes que loguearte. Haz click en el icono de usuario.');
    }
  }

  async openRanking() {
    if (this.idUser  !== null && this.idUser  !== undefined) {
      return this._router.navigate(['/ranking']).then(() => {
        this.idUser 
        window.location.reload();
      });
    } else {
      this.openSnackBar('Tienes que loguearte. Haz click en el icono de usuario.');
    }
  }

  async likeBlog(entryId: number) {
    if (this.likesCont === 3) {
      this.openSnackBar('Solo puedes dar a me gusta 3 veces.');
    } else {

      if (this.idUser  !== null && this.idUser  !== undefined) {
        const idBlog = entryId;
        this._blogService.likePlus(idBlog)
          .then(response => {
            console.log(response);
            console.log('Likes incrementados correctamente.');
            this.likesCont++;
          })
          .catch(error => {
            console.error(error);
            this.openSnackBar(`Error al incrementar los likes.`);
          });
      } else {
        this.openSnackBar('Tienes que loguearte. Haz click en el icono de usuario.');
      }
    }
  }
}
