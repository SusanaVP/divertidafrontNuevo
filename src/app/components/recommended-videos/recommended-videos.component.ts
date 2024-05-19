import { Component, OnInit } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideosService } from '../../services/videos.service';
import { StorageService } from '../../services/storage.service';
import { Video } from '../interfaces/videos';
import { Router } from '@angular/router';
import { categoriesVideos } from '../interfaces/categoryVideo';
import { FavoritesService } from '../../services/favorites.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-recommended-videos',
  templateUrl: './recommended-videos.component.html',
  styleUrls: ['./recommended-videos.component.scss'],
})
export class RecommendedVideosComponent implements OnInit {

  recommendedVideos: Video[] = [];
  slideIndex = 0;
  slideWidth = 0;
  favoriteVideosIds: Set<number> = new Set<number>();
  contentType: string = "video";
  contentId: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;


  constructor(private _videosService: VideosService,
    private _storageService: StorageService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _favoritesService: FavoritesService,
    private _snackBar: MatSnackBar) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }


  async ngOnInit() {
    this.loadRecommendedVideos();
   // this.idUser = this._storageService.getUserId();
    //this.isAdmin = this._storageService.isAdmin();
    this.loadFavoriteVideos();
  }

  async loadRecommendedVideos() {
    try {
      const videos = await this._videosService.getRecommendedVideos().toPromise();
      this.recommendedVideos = videos || [];
    } catch (error) {
      this.openSnackBar('Error al obtener los videos recomendados:');
      this.recommendedVideos = [];
    }
  }

  async loadFavoriteVideos() {
    try {
      const favoritesVideos = await this._favoritesService.getFavoritesVideos(this.idUser!);
      this.favoriteVideosIds = new Set<number>(favoritesVideos.map(video => video.id));
    } catch (error) {
      console.error('Error al obtener los videos favoritos:', error);
    }
  }

  getCategoriaVideo(categoryId: number): string {
    const category = categoriesVideos.find(a => a.id === categoryId);
    return category ? category.nameCategory : '';
  }

  async editFavorite(idVideo: number) {
    try {

      if (this.idUser !== null && this.idUser !== undefined) {
        const favoritesVideos = await this._favoritesService.getFavoritesVideos(this.idUser);
        this.favoriteVideosIds = new Set<number>(favoritesVideos.map(video => video.id));

        if (this.favoriteVideosIds.has(idVideo)) {
          this.contentId = idVideo;
          await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
          this.favoriteVideosIds.delete(idVideo);
          this.openSnackBar('Eliminado de tu lista de favoritos.');
        } else {
          this.contentId = idVideo;
          await this._favoritesService.addFavorite(this.contentId, this.idUser, this.contentType);
          this.openSnackBar('Añadido correctamente a tu lista de favoritos.');
          this.favoriteVideosIds.add(idVideo);
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