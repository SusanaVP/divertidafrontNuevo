import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../interfaces/blog';
import { BlogService } from '../../services/blog.service';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Video } from '../interfaces/videos';
import { VideosService } from '../../services/videos.service';
import { CategoryVideo } from '../interfaces/categoryVideo';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  idUser: number | null = null;
  isAdmin: boolean = false;
  blogEntries: Blog[] | undefined;

  public videoForm: FormGroup;
  public filteredVideos: Video[] = [];
  public searchTerm: string = '';
  public selectedCategory: string = '';
  public favoriteVideosIds: Set<number> = new Set<number>();
  public videosRecommendedIds: Set<number> = new Set<number>();
  public categoriesVideo: CategoryVideo[] = [];

  constructor(
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _blogService: BlogService,
    private fb: FormBuilder,
    private _videosService: VideosService,
    private dialog: MatDialog) {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      url: ['', Validators.required],
      recommended: [false]  // Campo por defecto
    });
  }

  async ngOnInit() {
    this.loadBlogNoValidated();
    this.loadCategories();

  }

  async loadCategories() {
    try {
      const categories = await this._videosService.getVideoCategories();

      if (categories !== null && categories !== undefined) {
        this.categoriesVideo = categories;

      } else {
        this.openSnackBar("No se han podido cargar las categorías de los vídeos.");
      }
    } catch (error) {
      this.openSnackBar("Error al cargar las categorías de los vídeos.")
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  loadBlogNoValidated() {
    this._blogService.getBlogNoValidated().subscribe(blog => {
      this.blogEntries = blog;
    },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
        }
        );
      }
    );
  }
  async editValidation(idBlog: number) {
    await this._blogService.editValidation(idBlog).then(response => {
      this.openSnackBar(response);
      this.openSnackBar('Entrada al blog validada correctamente.');
      this.loadBlogNoValidated();
    })
      .catch(error => {
        console.error(error);
        this.openSnackBar(`Error al validar la entrada al blog.`);
      });
  }
  
  async deleteBlog(idBlog: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          const response: string = await this._blogService.deleteBlog(idBlog);
          if (response === 'success') {
            this.openSnackBar('Entrada del blog eliminada correctamente');
            this.loadBlogNoValidated();
          } else {
            this.openSnackBar('Error al eliminar la entrada del blog');
          }
        } catch (error) {
          console.error('Error al procesar la solicitud:', error);
          this.openSnackBar('Error al eliminar la entrada del blog. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    });
  }

  async onSubmit() {
    if (this.videoForm.valid) {
      const selectedCategory = this.categoriesVideo.find(cat => cat.id === +this.selectedCategory);

      const newVideo: Video = {
        id: 0,
        title: this.videoForm.value.title,
        description: this.videoForm.value.description,
        url: this.videoForm.value.url,
        recommended: false,
        categoriesVideo: selectedCategory || { id: 0, nameCategory: '' }
      };

      try {
        if (this.isDataValidVideo(newVideo)) {
          const response = await this._videosService.addVideo(newVideo);

          if (response === 'success') {
            this.openSnackBar("Vídeo añadido correctamente.")
            this.videoForm.reset();
          } else {
            this.openSnackBar("Error, el vídeo no se ha podido añadir. Por favor, intentelo de nuevo más tarde.")
          }
        }
      } catch (error) {
        this.openSnackBar("Error al añadir el vídeo. Por favor, intentelo de nuevo más tarde.");
      }
    } else {
      this.openSnackBar("Todos los campos son obligatorios.")
    }
  }

  isDataValidVideo(video: Video): boolean {
    if (video.title.length > 100) {
      this.openSnackBar("El título es demasiado largo.");
      return false;
    }
    if (video.description.length > 255) {
      this.openSnackBar("La descripción es demasiado larga.");
      return false;
    }
    if (video.url.length > 255) {
      this.openSnackBar("La URL es demasiado larga.");
      return false;
    }
    return true;
  }
}
