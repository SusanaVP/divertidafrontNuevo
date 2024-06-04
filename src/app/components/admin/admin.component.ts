import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../interfaces/blog';
import { BlogService } from '../../services/blog.service';
import { Event } from '../interfaces/events';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Video } from '../interfaces/videos';
import { VideosService } from '../../services/videos.service';
import { CategoryVideo } from '../interfaces/categoryVideo';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../services/event.service';
import { CategoryRiddle } from '../interfaces/categoryRiddle';
import { CategoryStory } from '../interfaces/categoryStory';
import { RiddleService } from '../../services/riddle.service';
import { StoryService } from '../../services/story.service';
import { Riddles } from '../interfaces/riddles';
import { Stories } from '../interfaces/stories';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  @ViewChild('fileInputStory', { static: false }) fileInputStory!: ElementRef;
  @ViewChild('fileInputEvent', { static: false }) fileInputEvent!: ElementRef;

  idUser: number | null = null;
  isAdmin: boolean = false;
  blogEntries: Blog[] | undefined;

  imageDataEvent: string = '';
  imageDataStory: string = '';
  showPreviewEvent: boolean = false;
  showPreviewStory: boolean = false;

  public videoForm: FormGroup;
  public riddleForm: FormGroup;
  public storyForm: FormGroup;
  public eventForm: FormGroup;

  public filteredVideos: Video[] = [];
  public searchTerm: string = '';

  public selectedCategoryVideo: string = '';
  public selectedCategoryRiddle: string = '';
  public selectedCategoryStory: string = '';

  public favoriteVideosIds: Set<number> = new Set<number>();
  public videosRecommendedIds: Set<number> = new Set<number>();
  public categoriesVideo: CategoryVideo[] = [];
  public categoriesRiddles: CategoryRiddle[] = [];
  public categoriesStory: CategoryStory[] = [];

  urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
  datePattern = /^\d{4}-\d{2}-\d{2}$/;

  constructor(
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _blogService: BlogService,
    private fb: FormBuilder,
    private _videosService: VideosService,
    private dialog: MatDialog,
    private _eventService: EventService,
    private _riddlesService: RiddleService,
    private _storyService: StoryService) {

    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      url: ['', Validators.required],
      recommended: [false]
    });


    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern('^[^0-9]*$')]],
      description: ['', Validators.required],
      info: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern(this.urlPattern)]],
      date: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      town: ['', Validators.required],
      city: ['', Validators.required],
      image: ['']
    });

    this.riddleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      solution: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['']
    });
  }

  async ngOnInit() {
    this.loadBlogNoValidated();
    this.loadCategoriesVideo();
    this.loadCategoriesRiddle();
    this.loadCategoriesStory();
  }

  async loadCategoriesVideo() {
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

  async loadCategoriesStory() {
    try {
      const categories = await this._storyService.getStoryCategories();
      if (categories !== null && categories !== undefined) {
        this.categoriesStory = categories;

      } else {
        this.openSnackBar("No se han podido cargar las categorías de los cuentos.");
      }
    } catch (error) {
      this.openSnackBar("Error al cargar las categorías de los cuentos.")
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

  async editValidationBlog(idBlog: number) {
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

  async onSubmitVideo() {
    if (this.videoForm.valid) {
      const selectedCategoryVideo = this.categoriesVideo.find(cat => cat.id === +this.selectedCategoryVideo);

      const newVideo: Video = {
        id: 0,
        title: this.videoForm.value.title,
        description: this.videoForm.value.description,
        url: this.videoForm.value.url,
        recommended: false,
        categoriesVideo: selectedCategoryVideo || { id: 0, nameCategory: '' }
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
    if (video.title.length > 150) {
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

  async onSubmitEvent() {
    if (this.eventForm.valid && this.imageDataEvent) {
      const newEvent: Event = {
        id: 0,
        title: this.eventForm.value.title,
        description: this.eventForm.value.description,
        info: this.eventForm.value.info,
        url: this.eventForm.value.url,
        date: this.eventForm.value.date,
        latitude: this.eventForm.value.latitude,
        longitude: this.eventForm.value.longitude,
        town: this.eventForm.value.town,
        city: this.eventForm.value.city,
        image: this.imageDataEvent
      };

      try {
        if (this.isDataValidEvent(newEvent)) {
          const response = await this._eventService.addEvent(newEvent);

          if (response === 'success') {
            this.openSnackBar("Evento añadido correctamente.")
            this.eventForm.reset();
            this.cancelPicture()
            this.imageDataEvent = '';
          } else {
            this.openSnackBar("Error, el evento no se ha podido añadir. Por favor, intentelo de nuevo más tarde.")
          }
        }
      } catch (error) {
        this.openSnackBar("Error al añadir el evento. Por favor, intentelo de nuevo más tarde.");
      }
    } else {
      this.openSnackBar("Todos los campos son obligatorios.")
    }
  }

  // Función para validar datos de evento
  isDataValidEvent(event: Event): boolean {
    const titlePattern = /^[^0-9]*$/;
    const maxLength = 255;

    if (!titlePattern.test(event.title)) {
      this.openSnackBar("El título no debe contener números.");
      return false;
    }
    if (event.title.length > 150) {
      this.openSnackBar("El título es demasiado largo.");
      return false;
    }
    if (event.info.length > maxLength) {
      this.openSnackBar("La información es demasiado larga.");
      return false;
    }
    if (!this.urlPattern.test(event.url)) {
      this.openSnackBar("La URL no es válida.");
      return false;
    }
    if (event.town.length > maxLength) {
      this.openSnackBar("La población es demasiado larga.");
      return false;
    }
    if (event.city.length > maxLength) {
      this.openSnackBar("La ciudad es demasiado larga.");
      return false;
    }
    if (event.longitude === null || event.latitude === null) {
      this.openSnackBar("La latitud y longitud son obligatorias.");
      return false;
    }
    return true;
  }

  async onSubmitRiddle() {
    if (this.riddleForm.valid) {
      const selectedCategoryRiddle = this.categoriesRiddles.find(cat => cat.id === +this.selectedCategoryRiddle);

      const newRiddle: Riddles = {
        id: 0,
        title: this.riddleForm.value.title,
        description: this.riddleForm.value.description,
        solution: this.riddleForm.value.solution,
        categoriesRiddles: selectedCategoryRiddle || { id: 0, nameCategory: '' }
      };

      try {
        if (this.isDataValidRiddle(newRiddle)) {
          console.log(newRiddle)
          const response = await this._riddlesService.addRiddle(newRiddle);

          if (response === 'success') {
            this.openSnackBar("Adivinanza añadida correctamente.")
            this.riddleForm.reset();
          } else {
            this.openSnackBar("Error, la adivinanza no se ha podido añadir. Por favor, intentelo de nuevo más tarde.")
          }
        }
      } catch (error) {
        this.openSnackBar("Error al añadir la adivinanza. Por favor, intentelo de nuevo más tarde.");
      }
    } else {
      this.openSnackBar("Todos los campos son obligatorios.")
    }
  }

  isDataValidRiddle(riddle: Riddles): boolean {
    if (riddle.title.length > 150) {
      this.openSnackBar("El título es demasiado largo.");
      return false;
    }
    if (riddle.description.length > 255) {
      this.openSnackBar("La descripción es demasiado larga.");
      return false;
    }
    if (riddle.solution.length > 255){
      this.openSnackBar("La solución es demasiado larga.");
      return false;
    }
    return true;
  }

  async onSubmitStory() {
    if (this.storyForm.valid) {
      const selectedCategoryStory = this.categoriesStory.find(cat => cat.id === +this.selectedCategoryStory);

      const newStory: Stories = {
        id: 0,
        title: this.storyForm.value.title,
        description: this.storyForm.value.description,
        image: this.imageDataStory,
        categoriesStory: selectedCategoryStory || { id: 0, nameCategory: '' }
      };

      try {
        if (this.isDataValidStory(newStory)) {
          const response = await this._storyService.addStory(newStory);

          if (response === 'success') {
            this.openSnackBar("Cuento añadido correctamente.")
            this.storyForm.reset();
            this.cancelPicture()
            this.imageDataStory = '';
          } else {
            this.openSnackBar("Error, el cuento no se ha podido añadir. Por favor, intentelo de nuevo más tarde.")
          }
        }
      } catch (error) {
        this.openSnackBar("Error al añadir el cuento. Por favor, intentelo de nuevo más tarde.");
      }
    } else {
      this.openSnackBar("Todos los campos son obligatorios.")
    }
  }

  isDataValidStory(story: Stories): boolean {
    if (story.title.length > 150) {
      this.openSnackBar("El título es demasiado largo.");
      return false;
    }

    if (story.image === '' || story.image.length < 0) {
      this.openSnackBar("Debes añadir una imagen.");
      return false;
    }
    return true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageDataEvent = e.target.result;
        this.showPreviewEvent = true;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelectedStory(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageDataStory = e.target.result;
        this.showPreviewStory = true;
      };
      reader.readAsDataURL(file);
    }
  }

  cancelPicture() {
    this.showPreviewEvent = false;
    this.imageDataEvent = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  cancelPictureStory() {
    this.showPreviewStory = false;
    this.imageDataStory = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  cancelEvent() {
    this.eventForm.reset();
  }

  cancelStory() {
    this.storyForm.reset();
  }


}
