import { Component, OnInit } from '@angular/core';
import { Video } from '../interfaces/videos';
import { VideosService } from '../../services/videos.service';
import { FavoritesService } from '../../services/favorites.service';
import { StorageService } from '../../services/storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Riddles } from '../interfaces/riddles';
import { Stories } from '../interfaces/stories';
import { Event } from '../interfaces/events';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})

export class FavoritesComponent implements OnInit {

  videos: Video[] = [];

  favoriteVideosIds: Set<number> = new Set<number>();
  favoriteStoriesIds: Set<number> = new Set<number>();
  favoriteRiddlesIds: Set<number> = new Set<number>();
  favoriteEventsIds: Set<number> = new Set<number>();

  favoriteVideosList: Video[] = [];
  favoriteStoriesList: Stories[] = [];
  favoriteRiddlesList: Riddles[] = [];
  favoriteEventsList: Event[] = [];

  isLoggedIn: boolean = false;
  idUser: number | null = null;
  isAdmin: boolean = false;
  contentType: string = "";
  contentId: number = 0;
  currentIndex = 0;
  userId: number = 0;
  email: string = "";

  expandedStories: { [id: number]: boolean } = {};
  expandedRiddles: { [id: number]: boolean } = {};
  expandedEvents: { [id: number]: boolean } = {};

  constructor(private _favoritesService: FavoritesService,
    private _storageService: StorageService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _userService: UserService) {
  }

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
      await this.loadFavoritesUser();
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      console.log("Error al obtener el usuario logueado");
    }
  }

  async loadFavoritesUser() {
    try {
      const favoritesVideos = await this._favoritesService.getFavoritesVideos(this.idUser!);
      if (favoritesVideos.length == 0) {
        console.log('No tienes videos favoritos, añade alguno!!!');
      } else {
        this.favoriteVideosList = favoritesVideos;
      }

      const favoritesStories = await this._favoritesService.getFavoritesStories(this.idUser!);
      if (favoritesStories.length == 0) {
        console.log('No tienes cuentos favoritos, añade alguno!!!');
      } else {
        this.favoriteStoriesList = favoritesStories;
      }

      const favoritesRiddles = await this._favoritesService.getFavoritesRiddles(this.idUser!);
      if (favoritesRiddles.length == 0) {
        console.log('No tienes aivinanzas favoritas, añade alguna!!!');
      }
      else {
        this.favoriteRiddlesList = favoritesRiddles;
      }

      const favoritesEvents = await this._favoritesService.getFavoritesEvents(this.idUser!);
      if (favoritesEvents.length == 0) {
        console.log('No tienes eventos favoritos, añade alguno!!!');
      }
      else {
        this.favoriteEventsList = favoritesEvents;
      }

    } catch (err: any) {
      this.openSnackBar("ERROR: Al cargar los favoritos.");
    }
  }

  async editFavoriteVideo(idVideo: number) {
    this.favoriteVideosIds = new Set<number>(this.favoriteVideosList.map(video => video.id));
    try {
      this.contentId = idVideo;
      this.contentType = "video";
      await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
      this.favoriteVideosIds.delete(idVideo);
      this.favoriteVideosList = this.favoriteVideosList.filter(video => video.id !== idVideo);
      this.openSnackBar('Eliminado correctamente de tu lista de favoritos.');

    } catch (err: any) {
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
      this.openSnackBar("ERROR: Al añadir el vídeo a favoritos.");
    }
  }

  async editFavoriteStory(idStory: number) {
    this.favoriteStoriesIds = new Set<number>(this.favoriteStoriesList.map(story => story.id));
    try {
      this.contentId = idStory;
      this.contentType = "story";
      await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
      this.favoriteStoriesIds.delete(idStory);
      this.favoriteStoriesList = this.favoriteStoriesList.filter(story => story.id !== idStory);
      this.openSnackBar('Eliminado correctamente de tu lista de favoritos.');

    } catch (err: any) {
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
      this.openSnackBar("ERROR: Al añadir el cuento a favoritos.");
    }
  }

  async editFavoriteRiddle(idRiddle: number) {
    this.favoriteRiddlesIds = new Set<number>(this.favoriteRiddlesList.map(riddle => riddle.id));
    try {
      this.contentId = idRiddle;
      this.contentType = "riddle";
      await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
      this.favoriteRiddlesIds.delete(idRiddle);
      this.favoriteRiddlesList = this.favoriteRiddlesList.filter(riddle => riddle.id !== idRiddle);
      this.openSnackBar('Eliminado correctamente de tu lista de favoritos.');

    } catch (err: any) {
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
      this.openSnackBar("ERROR: Al añadir el cuento a favoritos.");
    }
  }

  async editFavoriteEvent(idEvent: number) {
    this.favoriteEventsIds = new Set<number>(this.favoriteEventsList.map(event => event.id));
    try {
      this.contentId = idEvent;
      this.contentType = "event";
      await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
      this.favoriteEventsIds.delete(idEvent);
      this.favoriteEventsList = this.favoriteEventsList.filter(event => event.id !== idEvent);
      this.openSnackBar('Eliminado correctamente de tu lista de favoritos.');

    } catch (err: any) {
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
      this.openSnackBar("ERROR: Al añadir el cuento a favoritos.");
    }
  }

  async openLogin() {
    this._router.navigate(['/login']);
  }

  goToVideosPage() {
    this._router.navigate(['/videos']);
  }

  goToRiddlesPage() {
    this._router.navigate(['/riddles']);
  }

  goToStoriesPage() {
    this._router.navigate(['/story']);
  }

  goToEventsPage() {
    this._router.navigate(['/events']);
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

  prevVideo() {
    this.currentIndex = (this.currentIndex - 1 + this.favoriteVideosList.length) % this.favoriteVideosList.length;
  }

  nextVideo() {
    this.currentIndex = (this.currentIndex + 1) % this.favoriteVideosList.length;
  }

  toggleExpandedStory(storyId: number): void {
    this.expandedStories[storyId] = !this.expandedStories[storyId];
  }

  toggleExpandedRiddles(riddleId: number): void {
    this.expandedRiddles[riddleId] = !this.expandedRiddles[riddleId];
  }

  toggleExpandidedEvent(eventId: number) {
    this.expandedEvents[eventId] = !this.expandedEvents[eventId];
  }

  formatDescription(description: string, wordsToShow: number, expand: boolean): string {
    const words = description.split(' ');
    let result = '';
    let currentWordsCount = 0;

    for (let i = 0; i < words.length; i++) {
      result += words[i] + ' ';
      currentWordsCount++;
      if (currentWordsCount === wordsToShow && !expand) {
        result += '<br><br>';
        break;
      }

      if (words[i].endsWith('.') && expand) {
        result += '<br><br>';
        currentWordsCount = 0;
      }
    }
    return result;
  }
}
