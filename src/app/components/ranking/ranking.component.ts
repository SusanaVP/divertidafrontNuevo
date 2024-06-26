import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { StorageService } from '../../services/storage.service';


import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../interfaces/blog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  private likesUpdateSubscription: Subscription = new Subscription();
  rankingList: { title: string, likes: number, position: number, image: string, description: string }[] = [];

  constructor(private _blogService: BlogService,
    private _storageService: StorageService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _authService: AuthService
  ) { }

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

    await this.loadBlogValidated();
    this.likesUpdateSubscription = this._blogService.getLikesUpdatedObservable().subscribe(() => {
      this.loadBlogValidated();
    });
  }

  ngOnDestroy(): void {
    if (this.likesUpdateSubscription) {
      this.likesUpdateSubscription.unsubscribe();
    }
  }

  loadBlogValidated(): void {
    this._blogService.getBlogValidated().subscribe(
      entries => {
        this.blogEntries = entries;
        this.updateRankingList(entries);
      },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
        });
      }
    );
  }

  updateRankingList(entries: Blog[]): void {
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
  }

  goToBlogPage() {
    this._router.navigate(['/blog']);
  }
}
