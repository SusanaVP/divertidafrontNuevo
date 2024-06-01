import { Component } from '@angular/core';
import { Riddles } from '../interfaces/riddles';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RiddleService } from '../../services/riddle.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryRiddle } from '../interfaces/categoryRiddle';

@Component({
  selector: 'app-view-riddles',
  templateUrl: './view-riddles.component.html',
  styleUrl: './view-riddles.component.css'
})
export class ViewRiddlesComponent {
  riddles: Riddles[] = [];
  expandedSolution: { [id: number]: boolean } = {};
  favoriteRiddlesIds: Set<number> = new Set<number>();
  favoriteRiddlesList: Riddles[] = [];
  contentType: string = "riddle";
  contentId: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;
  email: string = '';
  editingRiddleId: number | null = null;
  public selectedCategoryRiddle: string = '';
  public categoriesRiddles: CategoryRiddle[] = [];

  constructor(
    private _router: Router,
    private _favoritesService: FavoritesService,
    private _storageService: StorageService,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _userService: UserService,
    private _riddlesService: RiddleService,
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
    this.riddles = history.state.riddles;
    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
      this.email = decode.email;
    }
    this.loadFavoriteRiddles();
    this.loadCategoriesRiddle();

    if ( this.riddles.length > 0 ) {
      this.selectedCategoryRiddle = this.riddles[0].categoriesRiddles.id.toString();
    }
  }

  async loadFavoriteRiddles() {
    try {
      const user = await this._userService.getUserByEmail(this.email);
      if (user !== null && user !== undefined) {
        this.idUser = user.id;
      } else {
        console.log('Error al obtener el usuario:');
      }
      this.favoriteRiddlesList = await this._favoritesService.getFavoritesRiddles(this.idUser!);
      this.favoriteRiddlesIds = new Set<number>(this.favoriteRiddlesList.map(riddle => riddle.id));
    } catch (error) {
      console.error('Error al obtener los cuentos favoritos:', error);
    }
  }

  async loadCategoriesRiddle() {
    try {
      const categories = await this._riddlesService.getRiddleCategories();
      if (categories !== null && categories !== undefined) {
        this.categoriesRiddles = categories;

      } else {
        this.openSnackBar("No se han podido cargar las categorías de las adivinanzas.");
      }
    } catch (error) {
      this.openSnackBar("Error al cargar las categorías de las adivinanzas.")
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

  toggleExpandedSolution(riddleId: number): void {
    this.expandedSolution[riddleId] = !this.expandedSolution[riddleId];
  }

  async deleteRiddle(idRiddle: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          const response: string = await this._riddlesService.deleteRiddle(idRiddle);
          if (response === 'success') {
            this.openSnackBar('Adivinanza eliminada correctamente');
            this.riddles = this.riddles?.filter(riddle => riddle.id !== idRiddle);
          } else {
            this.openSnackBar('Error al eliminar la adivinanza.');
          }
        } catch (error) {
          console.error('Error al eliminar la avidinanza', error);
          this.openSnackBar('Error al eliminar la adivinanza. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    });
  }

  startEditing(id: number) {
    this.editingRiddleId = id;
  }

  onCategoryChange(event: any) {
    const newCategory = event.target.value;
    if (newCategory !== this.selectedCategoryRiddle) {
      this.riddles = this.riddles.filter(riddle => riddle.categoriesRiddles.id !== +newCategory);
      this.selectedCategoryRiddle = newCategory;
    }
  }

  async saveEditRiddle(riddle: Riddles) {
    this.editingRiddleId = null;

    const selectedCategoryRiddle = this.categoriesRiddles.find(cat => cat.id === +this.selectedCategoryRiddle);

    riddle.categoriesRiddles = selectedCategoryRiddle!;

    try {
        const response: string = await this._riddlesService.editRiddle(riddle);
        if (response === 'success') {
            this.openSnackBar('Adivinanza modificada correctamente');
            this.riddles = this.riddles!.filter(existingRiddle => existingRiddle.id !== riddle.id);
        } else {
            this.openSnackBar('Error al modificar la adivinanza.');
        }
    } catch (error) {
        console.error('Error al modificar la adivinanza', error);
        this.openSnackBar('Error al modificar la adivinanza. Por favor, inténtelo de nuevo más tarde.');
    }
}


  cancelEdit() {
    this.editingRiddleId = null;
  }

}
