import { Component, OnInit } from '@angular/core';
import { Stories } from '../interfaces/stories';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-stories',
  templateUrl: './view-stories.component.html',
  styleUrl: './view-stories.component.css'
})
export class ViewStoriesComponent implements OnInit {
  stories: Stories[] | undefined = [];
  dividedParagraphs: string[];
  maxWordsToShow: number = 30;
  expandedStories: { [id: number]: boolean } = {};
  favoritesStories: Stories[] = [];
  favoriteStoriesIds: Set<number> = new Set<number>();
  contentType: string = "story";
  contentId: number = 0;
  idUser: number | null = null;

  constructor(private _route: ActivatedRoute, private _router: Router, private _favoritesService: FavoritesService, private _storageService: StorageService, private _snackBar: MatSnackBar) {
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
    this.stories = history.state.stories;
    this.idUser = await this._storageService.getUserId('loggedInUser');
    this.loadFavoriteStories();
  }

  async loadFavoriteStories() {
    try {
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
          window.location.reload();
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



  divideTextIntoParagraphs(text: string) {
    // Dividir el texto en párrafos utilizando el delimitador ". "
    const paragraphs = text.split('. ');

    // Recorrer cada párrafo para dividir las líneas de diálogo y almacenarlas en un array
    paragraphs.forEach(paragraph => {
      // Dividir el párrafo en líneas de diálogo utilizando el delimitador "-"
      const lines = paragraph.split('-');

      // Agregar cada línea de diálogo al array de párrafos divididos
      lines.forEach(line => {
        // Eliminar los espacios en blanco al principio y al final de la línea
        const trimmedLine = line.trim();
        // Si la línea no está vacía, agregarla al array de párrafos divididos
        if (trimmedLine !== '') {
          this.dividedParagraphs.push(trimmedLine);
        }
      });
    });
  }

  splitText(text: string): string[] {
    // Dividir el texto por guion ('-') para obtener cada línea de diálogo como un elemento en un array
    const lines = text.split('\n'); // Dividir el texto en líneas

    // Eliminar los espacios en blanco al principio y al final de cada línea
    const cleanedLines = lines.map(line => line.trim());

    return cleanedLines;
  }

  toggleExpanded(storyId: number): void {
    this.expandedStories[storyId] = !this.expandedStories[storyId]; // Alternar el estado de expansión
  }
}