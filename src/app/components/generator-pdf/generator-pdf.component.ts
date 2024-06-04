import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Video } from '../interfaces/videos';
import { Stories } from '../interfaces/stories';
import { Riddles } from '../interfaces/riddles';
import { Event } from '../interfaces/events';
import { FavoritesService } from '../../services/favorites.service';
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

  pdfSrc: any;
  pdfUrl: SafeUrl | undefined;

  constructor(
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  ngOnInit(): void {

  }

  generatePdf(favoriteVideos: Video[], favoriteStories: Stories[], favoriteRiddles: Riddles[], favoriteEvents: Event[]) {
    // Verificar que los datos no sean undefined o null
    const validFavoriteVideos = favoriteVideos || [];
    const validFavoriteStories = favoriteStories || [];
    const validFavoriteRiddles = favoriteRiddles || [];
    const validFavoriteEvents = favoriteEvents || [];

    const documentDefinition = {
      content: [
        { text: 'Resumen de mis favoritos en la web D de Divertida', style: 'header' },
        { text: 'Fecha: ' + new Date()!.toLocaleDateString(), style: 'subheader' },
        { text: 'Videos favoritos:', style: 'subheader' },
        ...validFavoriteVideos.flatMap(video => [
          { text: 'Título del vídeo:', bold: true },
          { text: video.title },
          { text: 'Descripción:', bold: true },
          { text: video.description },
          { text: 'URL:', bold: true },
          { text: video.url },
          { text: 'Categoría:', bold: true },
          { text: video.categoriesVideo.nameCategory },
          { text: '---' }
        ]),
        { text: 'Cuentos favoritos:', style: 'subheader' },
        ...validFavoriteStories.map(story => [
          { text: 'Título del cuento:', bold: true }, ({ text: story.title })]),
        { text: 'Adivinanzas favoritas:', style: 'subheader' },
        { text: '---' },
        ...validFavoriteRiddles.map(riddle => [{ text: 'Título de la adivinanza:', bold: true },
        ({ text: riddle.title })]), { text: '---' },
        { text: 'Eventos favoritos:', style: 'subheader' },
        ...validFavoriteEvents.flatMap(event => [
          { text: 'Título del evento:', bold: true },
          { text: event.title },
          { text: 'Descripción:', bold: true },
          { text: event.description },
          { text: 'Ciudad:', bold: true },
          { text: event.city },
          { text: 'Información adicional:', bold: true },
          { text: event.info },
          { text: '---' }
        ])
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number],


        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5] as [number, number, number, number]
        }
      }
    };


    // Genera el PDF utilizando pdfMake y lo convierte en un blob
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.getBlob((blob: Blob) => {
      // Convierte el blob en una URL segura utilizando DomSanitizer
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    });
  }
}
