import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { RiddleService } from '../../services/riddle.service';
import { Riddles } from '../interfaces/riddles';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-riddles',
  templateUrl: './riddles.component.html',
  styleUrl: './riddles.component.css'
})
export class RiddlesComponent {


  constructor(
    private _riddleService: RiddleService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  riddles: Riddles[] | undefined = [];
  public selectedCategory: string = '';

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.riddles = params['riddles'];
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async getCategoryRiddles(nameCategory: string) {
    try {
      const categories = await this._riddleService.getRiddleCategories();

      if (categories && categories.length > 0) {
        const selectedCategory = categories.find(cat => cat.nameCategory === nameCategory);

        if (selectedCategory) {
          const riddles = await this._riddleService.getRiddlesByCategory(selectedCategory.id);
          const navigationExtras: NavigationExtras = {
            state: {
              riddles: riddles
            }
          };
          this._router.navigate(['/view-riddles'], navigationExtras);
        } else {
          this.openSnackBar("No se encontró la categoría especificada.");
        }
      } else {
        this.openSnackBar("No se han podido cargar las categorías de las adivinanzas.");
      }
    } catch (error) {
      this.openSnackBar("Error al cargar las categorías las adivinanzas.");
    }
  }
}
