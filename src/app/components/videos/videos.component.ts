import { Component, HostListener, OnInit } from '@angular/core';
import { VideosService } from '../../services/videos.service';
import { StorageService } from '../../services/storage.service';
import { Video } from '../interfaces/videos';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoritesService } from '../../services/favorites.service';

type VideoProperty = "title" | "descriptions" | "category";
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent implements OnInit {

  public selectedCategory: VideoProperty = "title";
  public searchTerm: string = '';
  public categories: string[] = [];

  public selectedOptions: string[] = [];
  filteredVideos: Video[] = [];
  videos: Video[] = [];

  public showRecommendedVideos: boolean = false;
  favoriteVideosIds: Set<number> = new Set<number>();
  contentType: string = "video";
  contentId: number = 0;
  favoritesVideos: Video[] = [];
  idUser: number | null = null;

  constructor(private _videosService: VideosService,
    private _favoritesService: FavoritesService,
    private _storageService: StorageService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _snackBar: MatSnackBar) {
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async ngOnInit() {
    this.showRecommendedVideos = true;

    this.idUser = await this._storageService.getUserId('loggedInUser');
  }

  filterVideos() {
    try {
      this.showRecommendedVideos = false;

      if (this.searchTerm === null || this.searchTerm === undefined || this.searchTerm === '') {
        return;
      }

      this._videosService.getVideos().subscribe((videos) => {
        this.filteredVideos = videos;

        // Filtrar por categoría si la categoría es la propiedad seleccionada
        if (this.selectedCategory === 'category') {
          this.filteredVideos = this.filteredVideos.filter(item => {
            return item.categoriesVideo && item.categoriesVideo.nameCategory.toLowerCase().includes(this.searchTerm.toLowerCase());
          });
        } else {
          // Filtrar por título o descripción
          this.filteredVideos = this.filteredVideos.filter(item => {
            return (item.title && item.title.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
              (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
          });
        }
      });

    } catch (err: any) {
      this.openSnackBar("ERROR: Al filtrar los vídeos.");
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
      this.filteredVideos = [];
    }
  }

  async editFavorite(idVideo: number) {
    try {
      if (this.idUser !== null && this.idUser !== undefined) {
        this.favoritesVideos = await this._favoritesService.getFavoritesVideos(this.idUser);
        this.favoriteVideosIds = new Set<number>(this.favoritesVideos.map(video => video.id));

        if (this.favoriteVideosIds.has(idVideo)) {
          this.openSnackBar('Ups! El vídeo ya estaba en tu lista de favoritos.');
        } else {
          this.contentId = idVideo;
          await this._favoritesService.addFavorite(this.contentId, this.idUser!, this.contentType);
          this.openSnackBar('Añadido correctamente a tu lista de favoritos.');
        }
      } else {
        this.openSnackBar('Tienes que loguearte o registrarte.');
      }

    } catch (err: any) {
      this.openSnackBar("ERROR: Al añadir el vídeo a favoritos.");
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
    }
  }

  extractVideoId(url: string): string {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);

    return match ? match[1] : '';
  }

  getEmbeddedUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);

    return this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
}
