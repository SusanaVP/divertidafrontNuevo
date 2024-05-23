import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../services/story.service';
import { Stories } from '../interfaces/stories';
import {  NavigationExtras, Router } from '@angular/router';
import { CategoryStory } from '../interfaces/categoryStory';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent implements OnInit {

  constructor(private _storyService: StoryService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    ) { }

  stories: Stories[] | undefined = [];
  public selectedCategory: string = '';
  public categoriesStory: CategoryStory[] = [];

  async ngOnInit() {
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async getCategoryStory(nameCategory: string) {
    try {
      const categories = await this._storyService.getStoryCategories();

      if (categories && categories.length > 0) {
        const selectedCategory = categories.find(cat => cat.nameCategory === nameCategory);

        if (selectedCategory) {
          const stories = await this._storyService.getStoriesByCategory(selectedCategory.id);

          if (stories && stories.length > 0) {
            const navigationExtras: NavigationExtras = {
              state: {
                stories: stories
              }
            };
            this._router.navigate(['/view-stories'], navigationExtras);
          } else {
            this.openSnackBar("La lista de cuentos está vacía");
          }
        } else {
          this.openSnackBar("No se encontró la categoría especificada.");
        }
      } else {
        this.openSnackBar("No se han podido cargar las categorías de los cuentos.");
      }
    } catch (error) {
      this.openSnackBar("Error al cargar las categorías de los cuentos.");
    }
  }

}
