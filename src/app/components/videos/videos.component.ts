import { Component, OnInit } from '@angular/core';
import { VideosService } from '../../services/videos.service';
import { StorageService } from '../../services/storage.service';
import { Video } from '../interfaces/videos';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

type VideoProperty = "title" | "descriptions" | "category";
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent implements OnInit {

  constructor(private _videosService: VideosService, private _storageService: StorageService, private _sanitizer: DomSanitizer, private _router: Router) {
  }

  public selectedCategory: VideoProperty = "title";
  public searchTerm: string = '';
  public categories: string[] = [];

  public selectedOptions: string[] = [];
  filteredVideos: Video[] = [];
  videos: Video[] = [];

  public showRecommendedVideos: boolean = false;
  favoriteVideosIds: Set<number> = new Set<number>();

  async ngOnInit() {
    this.showRecommendedVideos = true;
  }

  // filterVideos() {
  //   try {
  //     this.showRecommendedVideos = false;

  //     if (this.searchTerm === null || this.searchTerm === undefined) {
  //       return;
  //     }

  //     this._videosService.getVideos().subscribe((videos) => {
  //       this.filteredVideos = videos;

  //       this.categories = ['title', 'descriptions', 'category'];

  //       if (this.categories.includes(this.selectedCategory)) {
  //         let findSelectedCategory: Video[] = this.filteredVideos.filter(item => {
  //           return item[this.selectedCategory] && item[this.selectedCategory].toString().toLowerCase().includes(this.searchTerm.toLowerCase());
  //         });

  //         if (findSelectedCategory.length === 0) {
  //           this.filteredVideos = [];
  //           return;
  //         }
  //       }
  //     });

  //   } catch (err: any) {
  //     this._router.navigate(['/error']).then(() => {
  //       window.location.reload();
  //       this.filteredVideos = [];
  //     });
  //   }
  // }
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
      console.log("ERROR: Al filtrar los vídeos.");
      this.filteredVideos = [];
    }
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
        console.log("ERROR: Al añadir el vídeo a favoritos.");
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
