import { Component, HostListener, OnInit } from '@angular/core';
import { VideosService } from '../../services/videos.service';
import { StorageService } from '../../services/storage.service';
import { Video } from '../interfaces/videos';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  videosRecommendedIds: Set<number> = new Set<number>();
  ListVideosRecommended: Video[] | undefined;

  public showRecommendedVideos: boolean = false;
  recommended: boolean = false;
  favoriteVideosIds: Set<number> = new Set<number>();
  contentType: string = "video";
  contentId: number = 0;
  favoritesVideos: Video[] = [];
  idUser: number | null = null;
  isAdmin: boolean = false;
  email: string = '';

  constructor(private _videosService: VideosService,
    private _favoritesService: FavoritesService,
    private _storageService: StorageService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _userService: UserService,
    private dialog: MatDialog) {
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
    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
      this.email = decode.email;
    }
    this.loadFavoriteVideos();
    this.loadRecommendedVideos();
  }

  async loadRecommendedVideos() {
    try {
      const videos = await this._videosService.getRecommendedVideos().toPromise();
      this.videosRecommendedIds = new Set<number>(videos!.map(video => video.id));
    } catch (error) {
      console.log("Error al cargar los videos recomendados");
    }
  }

  async loadFavoriteVideos() {
    try {
      const user = await this._userService.getUserByEmail(this.email);
      if (user !== null && user !== undefined) {
        this.idUser = user.id;
      } else {
        console.log("Error al obtener el usuario logueado");
      }
      const favoritesVideos = await this._favoritesService.getFavoritesVideos(this.idUser!);
      this.favoriteVideosIds = new Set<number>(favoritesVideos.map(video => video.id));
    } catch (error) {
      console.error('Error al obtener los videos favoritos:', error);
    }
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
          this.contentId = idVideo;
          await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
          this.favoriteVideosIds.delete(idVideo);
          this.openSnackBar('Eliminado de tu lista de favoritos.');
        } else {
          this.contentId = idVideo;
          await this._favoritesService.addFavorite(this.contentId, this.idUser!, this.contentType);
          this.favoriteVideosIds.add(idVideo);
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

  async editRecommended(idVideo: number) {
    try {
      const isRecommended = this.videosRecommendedIds.has(idVideo);

      if (isRecommended) {
        await this._videosService.deleteRecommendedVideo(idVideo);
        this.openSnackBar('Video eliminado de la lista de recomendados.');
        this.videosRecommendedIds.delete(idVideo);
      } else {
        await this._videosService.addRecommendedVideo(idVideo);
        this.openSnackBar('Video agregado a la lista de recomendados.');
        this.videosRecommendedIds.add(idVideo);
      }
    } catch (error) {
      console.error('Error al actualizar la lista de videos recomendados:', error);
      this.openSnackBar('Error al actualizar la lista de videos recomendados. Por favor, inténtelo de nuevo más tarde.');
    }
  }

  async deleteVideo(idVideo: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          const response: string = await this._videosService.deleteVideo(idVideo);
          if (response === 'success') {
            this.openSnackBar('Vídeo eliminado correctamente');
            this.filteredVideos = this.filteredVideos.filter(v => v.id !== idVideo);
          } else {
            this.openSnackBar('Error al eliminar el vídeo');
          }
        } catch (error) {
          console.error('Error al eliminar el vídeo', error);
          this.openSnackBar('Error al eliminar el vídeo. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    });
  }
}
