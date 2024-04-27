import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RiddleService } from '../../services/riddle.service';
import { Riddles } from '../interfaces/riddles';
import { CategoryRiddle, categoriesRiddles } from '../interfaces/categoryRiddle';

@Component({
  selector: 'app-riddles',
  templateUrl: './riddles.component.html',
  styleUrl: './riddles.component.css'
})
export class RiddlesComponent {

  constructor(private _riddleService: RiddleService, private _router: Router) { }
riddles: Riddles[] | undefined = [];
  categorySelected: string | undefined;
  async ngOnInit() {

    // this._storyService.getStory().subscribe((data: StoryCategory[]) => { 
    //   this.stories = data;
    //   if (this.stories.length === 0) {
    //     console.log("la lista de cuentos esta vacía");
    //   }
    // });
  }

  async getCategoryRiddles(nameCategory: string) {
    const name = categoriesRiddles.find((cn: CategoryRiddle )=> cn.nameCategory === nameCategory);
    const categoryId = name ? name.id : 0;

    try {
      const riddles= await this._riddleService.getRiddlesByCategory(categoryId);

      if (riddles.length > 0 || riddles !== undefined) {
        const navigationExtras: NavigationExtras = {
          state: {
            riddles: riddles
          }
        };
  
        this._router.navigate(['/viewRiddles'], navigationExtras);
      }
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error al obtener adivinanzas por categoría:', error);
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
    }
  }
}
