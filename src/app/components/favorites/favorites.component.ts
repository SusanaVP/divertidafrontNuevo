import { Component, OnInit } from '@angular/core';
import { Video } from '../interfaces/videos';
import { VideosService } from '../../services/videos.service';
import { FavoritesService } from '../../services/favorites.service';
import { StorageService } from '../../services/storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})

export class FavoritesComponent implements OnInit {

  videos: Video[] = [];
  favoriteVideosIds: Set<number> = new Set<number>();
  isLoggedIn: boolean = false;
  favoriteVideosList: Video[] = [];
  idUser: number | null = null;
  contentType:string = "";
  contentId: number = 0;

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
    const idUser = this._storageService.getUserId('loggedInUser');

    if (idUser !== null && idUser !== undefined) {
      this.idUser = idUser;
      await this.loadFavoritesUser();
      this.isLoggedIn = true;
    } else {
      this.openSnackBar("ERROR: El ID de usuario es nulo o indefinido.");
        this.isLoggedIn = false;
    }
  }


  async loadFavoritesUser() {
    try {
      //  const favoritesIdUser = await this._favoritesService.getFavoritesIdUser(this.idUser!);
        const favoritesVideos = await this._favoritesService.getFavoritesVideos(this.idUser!);
        /*Aquí toda la lógica de sacar que es cada cosa por si typocontent y leugo ahcer las llamadas al backend.. para que s emuestre en cada apartado del html..*/
  
        //this.favoriteVideosIds = new Set<number>(this.favoriteVideosList.map(video => video.id));
  
        if (favoritesVideos.length == 0) {
          this.openSnackBar('No tienes videos favoritos, añade alguno!!!');
        }else {
           this.favoriteVideosList = favoritesVideos;
        }
    } catch (err: any) {
      this.openSnackBar("ERROR: Al cargar los vídeos favoritos.");
    }
  }

  async editFavoriteVideo(idVideo: number) {
    const favoritesVideos = await this._favoritesService.getFavoritesVideos(this.idUser!);
    this.favoriteVideosIds = new Set<number>(favoritesVideos.map(video => video.id));
      try {
        if (this.favoriteVideosIds.has(idVideo)) {
          this.openSnackBar('Ups! El vídeo ya estaba en tu lista de favoritos.');
        } else {
          this.contentId = idVideo;
          this.contentType = "video";
          await this._favoritesService.addFavorite(this.contentId, this.idUser!, this.contentType);
          this.openSnackBar('Añadido correctamente a tu lista de favoritos.');
        }
      } catch (err: any) {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
        });
        this.openSnackBar("ERROR: Al añadir el vídeo a favoritos.");
      }
  }

  async openLogin() {
    this._router.navigate(['/login']);

  }

  goToVideosPage() {
    this._router.navigate(['/videos']);
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
