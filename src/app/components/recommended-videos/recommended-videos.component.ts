import { Component, OnInit } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideosService } from '../../services/videos.service';
import { StorageService } from '../../services/storage.service';
import { Video } from '../interfaces/videos';
import { Router } from '@angular/router';
import { CategoryVideo, categoriesVideos } from '../interfaces/categoryVideo';
import { CategoryStory } from '../interfaces/categoryStory';


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


  constructor(private _videosService: VideosService, private _storageService: StorageService, private _sanitizer: DomSanitizer, private _router: Router) { }

  ngOnInit(): void {
    this._videosService.getRecommendedVideos().subscribe((videos: Video[]) => {
      this.recommendedVideos = videos;
    
    }, (error) => {
      console.log('Error al obtener los videos recomendados:');
      this.recommendedVideos = [];
    });
  }
  
  getCategoriaVideo(categoryId: number): string {
    const category = categoriesVideos.find(a => a.id === categoryId);
    return category ? category.nameCategory : '';
  }

  async editFavorite(idVideo: number) {
    const idPerson = await this._storageService.getUserId('loggedInUser');
    const favoritesVideos = await this._videosService.getFavoritesVideos();
    this.favoriteVideosIds = new Set<number>(favoritesVideos.map(video => video.id));

    if (idPerson !== null && idPerson !== undefined) {
      try {
        if (this.favoriteVideosIds.has(idVideo)) {
         console.log('Ups! El vídeo ya estaba en tu lista de favoritos.');
        } else {
          await this._videosService.addFavoriteVideo(idVideo, idPerson);
         console.log('Añadido correctamente a tu lista de favoritos.');
        }
      } catch (err: any) {
       console.log("ERROR: Al añadir a la lista de favoritos.");
       this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
      }
    } else {
     console.log('Tienes que loguearte o registrarte. Ve a la página Inicio');
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