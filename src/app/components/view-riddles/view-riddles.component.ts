import { Component } from '@angular/core';
import { Riddles } from '../interfaces/riddles';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-riddles',
  templateUrl: './view-riddles.component.html',
  styleUrl: './view-riddles.component.css'
})
export class ViewRiddlesComponent {
  riddles: Riddles[] | undefined = [];
  dividedParagraphs: string[];
  maxWordsToShow: number = 30;
  expandedRiddles: { [id: number]: boolean } = {};
  
  constructor(private _route: ActivatedRoute, 
    private _router: Router) { 
    this.dividedParagraphs = [];
  }

  ngOnInit(): void {
      this.riddles = history.state.riddles;
  }

  chooseOtherCategory() {
    this._router.navigate(['/riddles']);
  }

  divideTextIntoParagraphs(text: string) {
    // Dividir el texto en párrafos utilizando el delimitador ". "
    const paragraphs = text.split('. ');

    // Recorrer cada párrafo para dividir las líneas de diálogo y almacenarlas en un array
    paragraphs.forEach(paragraph => {
      // Dividir el párrafo en líneas de diálogo utilizando el delimitador "-"
      const lines = paragraph.split('-');

      // Agregar cada línea de diálogo al array de párrafos divididos
      lines.forEach(line => {
        // Eliminar los espacios en blanco al principio y al final de la línea
        const trimmedLine = line.trim();
        // Si la línea no está vacía, agregarla al array de párrafos divididos
        if (trimmedLine !== '') {
          this.dividedParagraphs.push(trimmedLine);
        }
      });
    });
  }

  splitText(text: string): string[] {
    const lines = text.split('\n'); 
    const cleanedLines = lines.map(line => line.trim());
    
    return cleanedLines;
  }

  toggleExpanded(riddleId: number): void {
    this.expandedRiddles[riddleId] = !this.expandedRiddles[riddleId];
  }
}
