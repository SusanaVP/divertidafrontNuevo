import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { StorageService } from '../../services/storage.service';
import { Blog } from '../interfaces/blog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogEntries: Blog[] | undefined;
  loading: boolean = true;
  entry: number = 0;
  likesCont: number = 0;

  constructor(private _blogService: BlogService, private _storageService: StorageService, private _router: Router ) { }

  ngOnInit() {
    this.loading = true;

    this._blogService.getBlog().subscribe(entries => {
      this.blogEntries = entries;
      this.loading = false;
    },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
          this.loading = true;
        }
        );
      }
    );
  }

  async openBlogEntryForm() {
      const idPerson = await this._storageService.getUserId('loggedInUser');

      // if(idPerson !== null && idPerson !== undefined) {

        return this._router.navigate(['/blog-entry-form']).then(() => {
          idPerson
          window.location.reload();
        });
      // const modal = await this._modalController.create({
      //   component: BlogEntryFormComponent,
      //   componentProps: { id_person: idPerson }
      //  
     // return await modal.present();
    // } else {
    //   console.log('Tienes que loguearte o registrarte. Ve a la página Inicio.');
    // }
  }

  async openRankingModal() {
    const idPerson = await this._storageService.getUserId('loggedInUser');

    // if (idPerson !== null && idPerson !== undefined) {
      return this._router.navigate(['/ranking']).then(() => {
        idPerson
        window.location.reload();
      });
    // } else {
    //   console.log('Tienes que loguearte o registrarte. Ve a la página Inicio.');
    // }
  }

  async likeBlog(entryId: number) {
    if (this.likesCont === 3) {
      console.log('Solo puedes dar a me gusta 3 veces.');
    } else {
      const idPerson = await this._storageService.getUserId('loggedInUser');

      if (idPerson !== null && idPerson !== undefined) {
        const idBlog = entryId;
        this._blogService.likePlus(idBlog)
          .then(response => {
            console.log(response);
            console.log('Likes incrementados correctamente.');
            this.likesCont++;
          })
          .catch(error => {
            console.error(error);
            console.log(`Error al incrementar los likes.`);
          });
      } else {
        console.log('Tienes que loguearte o registrarte. Ve a la página Inicio.');
      }
    }
  }
}
