import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  eventsList: any[] = [
    {
      title: '',
      date: '',
      image: '',
      description: '',
      info: '',
      url: '',
      expandido: false
    },
  ];

  constructor(private _eventService: EventService, private _router: Router) { }

  ngOnInit() {
    this._eventService.getEvents().subscribe(entries => {
      this.eventsList = entries;
      console.log(entries);
    },
      error => {
        this._router.navigate(['/error']).then(() => {
          window.location.reload();
          this.eventsList = [];
        }
        );
      }
    );
  }

  toggleExpandido(event: any) {
    event.expand = !event.expand;
  }

  formatDescription(description: string, wordsToShow: number, expand: boolean): string {
    const words = description.split(' ');
    let result = '';
    let currentWordsCount = 0;

    for (let i = 0; i < words.length; i++) {
      result += words[i] + ' ';
      currentWordsCount++;
      if (currentWordsCount === wordsToShow && !expand) {
        result += '<br><br>';
        break;
      }

      if (words[i].endsWith('.') && expand) {
        result += '<br><br>';
        currentWordsCount = 0;
      }
    }
    return result;
  }
}
