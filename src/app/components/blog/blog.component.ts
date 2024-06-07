import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { StorageService } from '../../services/storage.service';
import { Blog } from '../interfaces/blog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogEntries: Blog[] | undefined;
  entry: number = 0;
  likesCont: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;
  email: string = '';

  localStorageLikesKey = 'blogLikes';

  constructor(private _blogService: BlogService,
    private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private _authService: AuthService,
    private dialog: MatDialog) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async ngOnInit() {
    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
      this.email = decode.email;
    }
    const user = await this._userService.getUserByEmail(this.email);
    if (user !== null && user !== undefined) {
      this.idUser = user.id;
    } else {
      console.log("Error al obtener el usuario logueado");
    }

    this.loadBlogValidated();
  }

  async loadBlogValidated() {
    await this._blogService.getBlogValidated().subscribe(entries => {
      this.blogEntries = entries;
    },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
        }
        );
      }
    );
  }

  async openBlogEntryForm() {
    if (this.idUser !== null && this.idUser !== undefined) {
      return this._router.navigate(['/blog-entry-form', { idUser: this.idUser, email: this.email }]);
    } else {
      return this.openSnackBar('Tienes que loguearte. Haz click en el icono de usuario.');
    }
  }

  async openRanking() {
    if (this.idUser !== null && this.idUser !== undefined) {
      return this._router.navigate(['/ranking']).then(() => {
        this.idUser
        this.email
        this.loadBlogValidated();
        window.location.reload();
      });
    } else {
      return this.openSnackBar('Tienes que loguearte. Haz click en el icono de usuario.');
    }
  }

  async likeBlog(entryId: number) {
    if (this.idUser === null || this.idUser === undefined) {
      this.openSnackBar('Tienes que loguearte. Haz click en el icono de usuario.');
      return;
    }

    const likesBlog = JSON.parse(this._storageService.getLocalStorageItem(this.localStorageLikesKey) || '{}');
    const currentTime = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    //const oneDay = 5 * 60 * 1000; // Para probar con 5 minutos

    if (!likesBlog[this.idUser]) {
      likesBlog[this.idUser] = { count: 0, lastLikeTime: 0 };
    }

    const { count, lastLikeTime } = likesBlog[this.idUser];

    if ((currentTime - lastLikeTime) > oneDay) {
      likesBlog[this.idUser].count = 0;
    }

    if (likesBlog[this.idUser].count < 3) {
      try {
        const idBlog = entryId;
        const response: string = await this._blogService.likePlus(idBlog);
        if (response === 'success') {
          this.openSnackBar('Likes incrementados correctamente.');

          // Incrementa el conteo de likes y actualiza la marca de tiempo
          likesBlog[this.idUser].count++;
          likesBlog[this.idUser].lastLikeTime = currentTime;
          this._storageService.setLocalStorageItem(this.localStorageLikesKey, JSON.stringify(likesBlog));
        } else {
          this.openSnackBar('Error al incrementar los likes.');
        }
      } catch (error) {
        this.openSnackBar(`Error al incrementar los likes.`);
      }
    } else {
      this.openSnackBar('Solo puedes dar a me gusta 3 veces cada 24 horas.');
    }
  }

  async deleteBlog(idBlog: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          const response: string = await this._blogService.deleteBlog(idBlog);
          if (response === 'success') {
            this.openSnackBar('Entrada del blog eliminada correctamente');
            this.loadBlogValidated();
          } else {
            this.openSnackBar('Error al eliminar la entrada del blog');
          }
        } catch (error) {
          console.error('Error al eliminar la entrada al blog', error);
          this.openSnackBar('Error al eliminar la entrada del blog. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    });
  }
}
