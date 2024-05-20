import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../interfaces/blog';
import { User } from '../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog-entry-form',
  templateUrl: './blog-entry-form.component.html',
  styleUrl: './blog-entry-form.component.css'
})
export class BlogEntryFormComponent implements OnInit {
  @Input() idUser: number | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef;

  public entryForm: FormGroup;
  imageData: string | undefined;
  showPreview: boolean = false;
  submitting: boolean = false;
  email: string = '';

 blogEntryData: Blog = {
    id: 0,
    title: '',
    description:'',
    image: '',
    user:{} as User,
    heart: 0,
    validado: false
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _blogService: BlogService,
    private _userService: UserService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) {

    this.entryForm = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idUser = params['idUser'];
      this.email = params['email'];
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async submitForm() {
    if (!this.submitting) {
      this.submitting = true;

      if (this.entryForm.valid && this.imageData && this.idUser) {
        const user: User | undefined = await this._userService.getUserByEmail(this.email);
        if (user !== null && user !== undefined) {
          this.idUser = user.id;
          this.blogEntryData = {
            id: 0,
            title: this.entryForm.value.title,
            description: this.entryForm.value.description,
            image: this.imageData,
            user: user,
            heart: 0,
            validado: false
          };
        }

        try {
          const response: string = await this._blogService.addBlogEntry(this.blogEntryData);
          if (response === 'success') {
            this._router.navigate(['/blog']).then(() => {
              window.location.reload();
              this.openSnackBar('');
              const confirmDelete = window.confirm('Añadida al blog correctamente. En un plazo mázimo de 24h podrá visulizarla.');
            });
          } else {
            this.openSnackBar('Error al guardar la entrada del blog, inténtelo de nuevo más tarde.');
          }
        } catch (error) {
          this.openSnackBar('Error al enviar al blog. Por favor, inténtelo de nuevo más tarde.');
        }
      } else {
        this.openSnackBar('Por favor, complete todos los campos y suba una foto.');
      }
      this.submitting = false;
    }
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageData = e.target.result;
        this.showPreview = true;
      };
      reader.readAsDataURL(file);
    }
  }

  cancelPicture() {
    this.showPreview = false;
    this.imageData = undefined;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  cancelEntryBlog() {
    this._router.navigate(['/blog']).then(() => {
    });
  }
}
