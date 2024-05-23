import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { StorageService } from '../../services/storage.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../interfaces/blog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent {
  blogEntries: Blog[] | undefined;
  entry: number = 0;
  likesCont: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;
  email: string = '';
  rankingList: { title: string, likes: number, position: number, image: string, description: string}[] = [];

  constructor(private _blogService: BlogService,
    private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private _authService: AuthService
  ) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  ngOnInit() {
    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
      this.email = decode.email;
    }

    this.loadBlogValidated();
  }


  loadBlogValidated(): void {
    this._blogService.getBlogValidated().subscribe(
      entries => {
        this.blogEntries = entries;
        const filteredData = entries
          .filter(blog => blog.likes !== 0)
          .sort((a, b) => b.likes - a.likes);
        this.rankingList = filteredData.map((blog, index) => ({
          title: blog.title,
          description: blog.description, 
          likes: blog.likes,
          image: blog.image,
          position: index + 1
        }));
      },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
        });
      }
    );
  }
}
