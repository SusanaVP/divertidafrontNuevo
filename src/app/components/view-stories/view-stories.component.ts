import { Component, OnInit } from '@angular/core';
import { Stories } from '../interfaces/stories';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { StoryService } from '../../services/story.service';
import { CategoryStory } from '../interfaces/categoryStory';

@Component({
  selector: 'app-view-stories',
  templateUrl: './view-stories.component.html',
  styleUrl: './view-stories.component.css'
})
export class ViewStoriesComponent implements OnInit {
  stories: Stories[] = [];
  dividedParagraphs: string[];
  maxWordsToShow: number = 30;
  expandedStories: { [id: number]: boolean } = {};
  favoritesStories: Stories[] = [];
  favoriteStoriesIds: Set<number> = new Set<number>();
  contentType: string = "story";
  contentId: number = 0;
  idUser: number | null = null;
  isAdmin: boolean = false;
  email: string = '';
  selectedStory: Stories | null = null;
  public isEditing: any;
  public categoriesVideo: CategoryStory[] = [];
  editingStoryId: number | null = null;


  constructor(
    private _router: Router,
    private _favoritesService: FavoritesService,
    private _storageService: StorageService,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _userService: UserService,
    private dialog: MatDialog,
    private _storyService: StoryService,
    private route: ActivatedRoute) {
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
    this.stories = history.state.stories || [];
    const token = this._storageService.getToken();
    if (token && token.length > 0) {
      const decode = this._authService.decodeJwtToken(token);
      this.isAdmin = decode.isAdmin;
      this.email = decode.email;
    }
    this.loadFavoriteStories();
  }

  async loadFavoriteStories() {
    try {
      const user = await this._userService.getUserByEmail(this.email);
      if (user !== null && user !== undefined) {
        this.idUser = user.id;
      } else {
        console.log('Error al obtener el usuario:');
      }

      this.favoritesStories = await this._favoritesService.getFavoritesStories(this.idUser!);
      this.favoriteStoriesIds = new Set<number>(this.favoritesStories.map(story => story.id));
    } catch (error) {
      console.error('Error al obtener los cuentos favoritos:', error);
    }
  }

  chooseOtherCategory() {
    this._router.navigate(['/story']);
  }

  async editFavoriteStory(idStory: number) {
    try {
      if (this.idUser !== null && this.idUser !== undefined) {
        if (this.favoriteStoriesIds.has(idStory)) {
          this.contentId = idStory;

          await this._favoritesService.deleteFavorite(this.contentId, this.idUser!, this.contentType);

          this.favoriteStoriesIds.delete(idStory);
          this.openSnackBar('Eliminado de tu lista de favoritos.');

        } else {
          this.contentId = idStory;
          await this._favoritesService.addFavorite(this.contentId, this.idUser, this.contentType);
          this.openSnackBar('Añadido correctamente a tu lista de favoritos.');
          this.favoriteStoriesIds.add(idStory);
        }
      } else {
        this.openSnackBar('Tienes que loguearte o registrarte.');
      }
    } catch (err: any) {
      this.openSnackBar("ERROR: Al añadir el cuento a favoritos.");
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
    }
  }

  toggleExpandedStory(storyId: number): void {
    this.expandedStories[storyId] = !this.expandedStories[storyId];
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

  async deleteStory(idStory: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          const response: string = await this._storyService.deleteStory(idStory);
          if (response === 'success') {
            this.openSnackBar('Cuento eliminado correctamente');
            this.stories = this.stories?.filter(story => story.id !== idStory);
          } else {
            this.openSnackBar('Error al eliminar el cuento.');
          }
        } catch (error) {
          console.error('Error al eliminar la entrada al blog', error);
          this.openSnackBar('Error al eliminar el cuento. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    });
  }

  startEditing(id: number) {
    this.editingStoryId = id;
  }

  async saveEditStory(story: Stories) {
    this.editingStoryId = null;

    try {
      const response: string = await this._storyService.editStory(story);
      if (response === 'success') {
        this.openSnackBar('Cuento modificado correctamente');
        this.stories = this.stories!.map(existingStory =>
          existingStory.id === story.id ? story : existingStory
        );
      } else {
        this.openSnackBar('Error al modificar el cuento.');
      }
    } catch (error) {
      console.error('Error al modificar el cuento', error);
      this.openSnackBar('Error al modificar el cuento. Por favor, inténtelo de nuevo más tarde.');
    }
  }


  cancelEdit() {
    this.editingStoryId = null;
  }

}