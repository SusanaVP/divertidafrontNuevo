import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Blog } from '../interfaces/blog';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-blog-entry-form',
  templateUrl: './blog-entry-form.component.html',
  styleUrl: './blog-entry-form.component.css'
})
export class BlogEntryFormComponent {
  @Input() id_person: number | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  public entryForm: FormGroup;
  imageData: string | undefined;
  fileToUpload: File | null = null;
  selectedFile: File | undefined;
  showPreview: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _blogService: BlogService,
    private _userService: UserService,
    private _router: Router) {

    this.entryForm = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
  };

  async takePicture() {

    // const image = await Camera.getPhoto({
    //   resultType: CameraResultType.DataUrl,
    // });

    // if (image && image.dataUrl) {
    //   const base64Image = image.dataUrl;
    //   this.imageData = image.dataUrl;
    //   this.entryForm.patchValue({ image: base64Image });
    // } else {
    //  console.log('No se pudo obtener la imagen');
    // }
  }

  async submitForm() {
    /*if (this.entryForm.valid && this.imageData && this.id_person) {
      const user: User = await this._userService.getPersonById(this.id_person);

      const blogEntryData: Blog = {
        id: 0,
        title: this.entryForm.value.title,
        description: this.entryForm.value.description,
        image: this.imageData,
        user: user,
        heart: 0
      };

      try {
        const response: string = await this._blogService.addBlogEntry(blogEntryData);
        if (response === 'success') {
         console.log('Añadida al blog correctamente');
          this.dismissModal();

          this._router.navigate(['/blog']).then(() => {
            window.location.reload();
           console.log('Añadida al blog correctamente');
          });
        } else {
         console.log('Error al guardar la entrada del blog, inténtelo de nuevo más tarde.');
        }
      } catch (error) {
       console.log('Error al enviar al blog. Por favor, inténtelo de nuevo más tarde.');
      }
    } else {
     console.log('Por favor, complete todos los campos y tome una foto.');
    }*/
  };

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.fileToUpload = file;
  //     this.readImageFile(file);
  //   }
  // }

  readImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageData = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  cancelPicture() {
    this.showPreview = false;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Establece el valor del campo de entrada de archivos como cadena vacía
    }
  }

  cancelEntryBlog() {
    this._router.navigate(['/blog']).then(() => {
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageData = e.target.result;
        this.showPreview = true; // Mostrar la vista previa de la imagen
      };
      reader.readAsDataURL(file);
    }
  }
}
