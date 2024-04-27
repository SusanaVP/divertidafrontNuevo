import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../services/story.service';
import { Stories } from '../interfaces/stories';
import { NavigationExtras, Router } from '@angular/router';
import { CategoryStory, categoriesStories } from '../interfaces/categoryStory';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent implements OnInit {

  constructor(private _storyService: StoryService, private _router: Router) { }

  stories: Stories[] | undefined = [];
  categorySelected: string | undefined;
  async ngOnInit() {

    // this._storyService.getStory().subscribe((data: StoryCategory[]) => { 
    //   this.stories = data;
    //   if (this.stories.length === 0) {
    //     console.log("la lista de cuentos esta vacía");
    //   }
    // });
  }

  async getCategoryStory(nameCategory: string) {
    const name = categoriesStories.find((cn: CategoryStory )=> cn.nameCategory === nameCategory);
    const categoryId = name ? name.id : 0;

    try {
      const stories = await this._storyService.getStoriesByCategory(categoryId);

      if (stories.length > 0 || stories !== undefined) {
        const navigationExtras: NavigationExtras = {
          state: {
            stories: stories
          }
        };
  
        this._router.navigate(['/view-stories'], navigationExtras);
      }else {
        console.log("la lista de historias esta vacía");
      }

    } catch (error) {
      console.error('Error al obtener historias por categoría:', error);
      this._router.navigate(['/error']).then(() => {
        window.location.reload();
      });
    }
  }
}
