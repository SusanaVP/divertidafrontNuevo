import { Component } from '@angular/core';
import { Riddles } from '../interfaces/riddles';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-riddles',
  templateUrl: './view-riddles.component.html',
  styleUrl: './view-riddles.component.css'
})
export class ViewRiddlesComponent {
  riddles: Riddles[] | undefined = [];
  dividedParagraphs: string[];
  maxWordsToShow: number = 30;
  expandedRiddles: { [id: number]: boolean } = {};
  favoriteRiddlesIds: Set<number> = new Set<number>();
  favoriteRiddlesList: Riddles[] = [];
  contentType: string = "riddle";
  contentId: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;

  constructor(private _route: ActivatedRoute,
    private _router: Router, private _favoritesService: FavoritesService, private _storageService: StorageService, private _snackBar: MatSnackBar) {
    this.dividedParagraphs = [];
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async ngOnInit() {
    this.riddles = history.state.riddles;
    //this.idUser = this._storageService.getUserId();
   // this.isAdmin = this._storageService.isAdmin();
    this.loadFavoriteRiddles();
  }

  async loadFavoriteRiddles() {
    try {
      this.favoriteRiddlesList = await this._favoritesService.getFavoritesStories(this.idUser!);
      this.favoriteRiddlesIds = new Set<number>(this.favoriteRiddlesList.map(riddle => riddle.id));
    } catch (error) {
      console.error('Error al obtener los cuentos favoritos:', error);
    }
  }
  
  chooseOtherCategory() {
    this._router.navigate(['/riddles']);
  }

  
  async editFavoriteRiddle(idRiddle: number) {
    try {
      if (this.idUser !== null && this.idUser !== undefined) {
        const favoritesRiddles = await this._favoritesService.getFavoritesRiddles(this.idUser);
        this.favoriteRiddlesIds = new Set<number>(favoritesRiddles.map(riddle => riddle.id));

        if (this.favoriteRiddlesIds.has(idRiddle)) {
          this.contentId = idRiddle;
          await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);
          this.favoriteRiddlesIds.delete(idRiddle);
          this.openSnackBar('Ups! La adivinanza ya estaba en tu lista de favoritos.');
        } else {
          this.contentId = idRiddle;
          await this._favoritesService.addFavorite(this.contentId, this.idUser, this.contentType);
          this.openSnackBar('Añadido correctamente a tu lista de favoritos.');
          this.favoriteRiddlesIds.add(idRiddle);
        }
      } else {
        this.openSnackBar('Tienes que loguearte o registrarte.');
      }
    } catch (err: any) {
      this.openSnackBar("ERROR: Al añadir la adivinanza a favoritos.");
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
    }
  }

  toggleExpandedRiddles(riddleId: number): void {
    this.expandedRiddles[riddleId] = !this.expandedRiddles[riddleId];
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
