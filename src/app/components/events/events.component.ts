import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../interfaces/events';
import { StorageService } from '../../services/storage.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  latitudeUser: number = 0;
  longitudeUser: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;
  email: string = '';


  favoriteEventsIds: Set<number> = new Set<number>();
  favoriteEventsList: Event[] = [];
  selectedCategoryEvents: string = 'nearby';
  sortedEventsList: Event[] = [];
  eventsList: Event[] = [];
  townSelected: string = '';
  ListTowns: string[] = [];
  isLoading: boolean = true;

  contentType: string = "event";
  contentId: number = 0;
  favoritesEvents: Event[] = [];
  expandedEvents: { [id: number]: boolean } = {};

  constructor(private _eventService: EventService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _storageService: StorageService,
    private _favoritesService: FavoritesService,
    private _authService: AuthService,
    private _userService: UserService,
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
      this.loadFavoriteEvents();
    }
    this.geolocationVerify();
    await this.loadEvents();
  }

  async loadEvents() {
    this.isLoading = true;
    try {
      await this._eventService.getEvents().subscribe(entries => {
        this.eventsList = entries.map(event => ({ ...event, expand: false }));
        this.sortEventsByDistanceNearby();
        this.ListTowns = Array.from(new Set(this.eventsList.map(event => event.town)));
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error al obtener los eventos', error);
      this.isLoading = false;
    }
  }

  onChangeSelected() {
    if (this.selectedCategoryEvents === 'nearby' || this.selectedCategoryEvents === 'far') {
      if (this.latitudeUser === 0 && this.longitudeUser === 0) {
        this.openSnackBar('Debes permitir el acceso a tu ubicación para buscar eventos cercanos o lejanos.');
        this.selectedCategoryEvents = 'town';
        return;
      }
    }
    if (this.selectedCategoryEvents === 'nearby') {
      this.sortEventsByDistanceNearby();
      this.townSelected = '';
    } else if (this.selectedCategoryEvents === 'far') {
      this.sortEventsByDistanceFar();
      this.townSelected = '';
    } else if (this.selectedCategoryEvents === 'closestDate') {
      this.sortEventsByClosestDate();
      this.townSelected = '';
    } else {
      this.ListTowns;
      this.townSelected = this.ListTowns[0];
    }

  }

  async loadFavoriteEvents() {
    try {
      const user = await this._userService.getUserByEmail(this.email);
      if (user !== null && user !== undefined) {
        this.idUser = user.id;
      } else {
        console.log("Error al obtener el usuario logueado");
      }
      this.favoriteEventsList = await this._favoritesService.getFavoritesEvents(this.idUser!);
      this.favoriteEventsIds = new Set<number>(this.favoriteEventsList.map(event => event.id));
    } catch (error) {
      console.error('Error al obtener los eventos favoritos:', error);
    }
  }

  async geolocationVerify() {
    if ('geolocation' in navigator) {
      await navigator.geolocation.getCurrentPosition(position => {
        this.latitudeUser = position.coords.latitude;
        this.longitudeUser = position.coords.longitude;
      }, error => {
        this.openSnackBar('Has cancelado la geolocalización para obtener la ubicación:');

      });
    } else {
      this.openSnackBar('La geolocalización no es compatible con este navegador.');
    }
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

  async editFavoriteEvent(idEvent: number) {
    try {
      if (this.idUser !== null && this.idUser !== undefined) {
        const favoritesEvents = await this._favoritesService.getFavoritesEvents(this.idUser);
        this.favoriteEventsIds = new Set<number>(favoritesEvents.map(event => event.id));

        if (this.favoriteEventsIds.has(idEvent)) {
          this.contentId = idEvent;
          await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
          this.favoriteEventsIds.delete(idEvent);
          this.openSnackBar('Eliminado de tu lista de favoritos.');
        } else {
          this.contentId = idEvent;
          await this._favoritesService.addFavorite(this.contentId, this.idUser!, this.contentType);
          this.favoriteEventsIds.add(idEvent);
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

  sortEventsByDistanceNearby() {
    this.sortedEventsList = [...this.eventsList].sort((a, b) => {
      return this.calculateDistance(a) - this.calculateDistance(b);
    });
  }

  sortEventsByDistanceFar() {
    this.sortedEventsList = [...this.eventsList].sort((a, b) => {
      return this.calculateDistance(b) - this.calculateDistance(a);
    });
  }

  sortEventsByClosestDate() {
    this.sortedEventsList = [...this.eventsList].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return Math.abs(dateA.getTime() - new Date().getTime()) - Math.abs(dateB.getTime() - new Date().getTime());
    });
  }

  calculateDistance(event: Event): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const lat1 = this.latitudeUser;
    const lon1 = this.longitudeUser;
    const lat2 = event.latitude;
    const lon2 = event.longitude;

    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async deleteEvent(idEvent: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          const response: string = await this._eventService.deleteEvent(idEvent);
          if (response === 'success') {
            this.openSnackBar('Evento eliminada correctamente');
            this.loadEvents();
          } else {
            this.openSnackBar('Error al eliminar el evento');
          }
        } catch (error) {
          console.error('Error al eliminar el evento', error);
          this.openSnackBar('Error al eliminar el evento. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    });
  }

  filterEvents() {
    if (this.selectedCategoryEvents === 'town' && this.townSelected.trim() !== '') {
      this.sortedEventsList = this.eventsList.filter(event => event.town.toLowerCase() === this.townSelected.toLowerCase());
    } else {
      this.sortEventsByDistanceNearby();
    }
  }

  formatSpanishDate(dateString: Date): string {
    // Obtener la fecha como objeto Date
    const date = new Date(dateString);
    // Obtener el día, mes y año
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    // Array de nombres de meses en español
    const spanishMonths = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    // Formatear la fecha en el formato deseado
    return `${day}-${spanishMonths[monthIndex]}-${year}`;
  }
}
