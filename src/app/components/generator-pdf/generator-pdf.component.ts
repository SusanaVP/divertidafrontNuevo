import { Component, Input, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { StorageService } from '../../services/storage.service';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Video } from '../interfaces/videos';
import { Stories } from '../interfaces/stories';
import { Riddles } from '../interfaces/riddles';
import { Event } from '../interfaces/events';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-generator-pdf',
  templateUrl: './generator-pdf.component.html',
  styleUrl: './generator-pdf.component.css'
})
export class GeneratorPDFComponent implements OnInit {

  @Input() idUser: number | undefined;
  
  @Input() favoriteVideos: Video[] = [];
  @Input() favoriteStories: Stories[] = [];
  @Input() favoriteRiddles: Riddles[] = [];
  @Input() favoriteEvents: Event[] = [];
  email: string = '';

  constructor(private _blogService: BlogService,
    private _storageService: StorageService,
    private _router: Router,
    private _userService: UserService,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { 
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idUser = params['idUser'];
      this.email = params['email'];
    });
    // Verifica si se recibieron datos de favoritos
    if (this.favoriteVideos && this.favoriteStories && this.favoriteRiddles && this.favoriteEvents) {
      // Lógica para generar el PDF con los datos de favoritos
      this.generatePdf(this.favoriteVideos, this.favoriteStories, this.favoriteRiddles, this.favoriteEvents);
    } else {
      console.error('No se recibieron datos de favoritos');
    }
  }

  
  generatePdf(favoriteVideos: Video[], favoriteStories: Stories[], favoriteRiddles: Riddles[], favoriteEvents: Event[]) {
    // Lógica para construir el contenido del PDF con los datos recibidos
    const documentDefinition = {
      content: [
        { text: 'Resumen de favoritos', style: 'header' },
        { text: 'Videos favoritos:', style: 'subheader' },
        ...favoriteVideos.map(video => {
          return { text: `${video.title} - ${video.description}` };
        }),
        { text: 'Cuentos favoritos:', style: 'subheader' },
        ...favoriteStories.map(story => {
          return { text: `${story.title} - ${story.description}` };
        }),
        { text: 'Adivinanzas favoritas:', style: 'subheader' },
        ...favoriteRiddles.map(riddle => {
          return { text: `${riddle.title} - ${riddle.description}` };
        }),
        { text: 'Eventos favoritos:', style: 'subheader' },
        ...favoriteEvents.map(event => {
          return { text: `${event.title} - ${event.description}` };
        })
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number] 
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5] as [number, number, number, number] 
        }
      }
    };

    // Genera el PDF utilizando pdfMake
    pdfMake.createPdf(documentDefinition).open();
  }

}
