import { Component, OnInit } from '@angular/core';
import { Stories } from '../interfaces/stories';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-stories',
  templateUrl: './view-stories.component.html',
  styleUrl: './view-stories.component.css'
})
export class ViewStoriesComponent implements OnInit {
  stories: Stories[] | undefined = [];
  dividedParagraphs: string[];
  maxWordsToShow: number = 30;
  expandedStories: { [id: number]: boolean } = {};
  
  constructor(private _route: ActivatedRoute, private _router: Router) { 
    this.dividedParagraphs = [];
  }

  ngOnInit(): void {
      this.stories = history.state.stories;
  }

  chooseOtherCategory() {
    this._router.navigate(['/story']);
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
    // Dividir el texto por guion ('-') para obtener cada línea de diálogo como un elemento en un array
    const lines = text.split('\n'); // Dividir el texto en líneas

    // Eliminar los espacios en blanco al principio y al final de cada línea
    const cleanedLines = lines.map(line => line.trim());
    
    return cleanedLines;
  }

  toggleExpanded(storyId: number): void {
    this.expandedStories[storyId] = !this.expandedStories[storyId]; // Alternar el estado de expansión
  }
}