import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Event } from '../components/interfaces/events';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl: string = environment.eventUrl;

  constructor(private _http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this._http.get<Event[]>(`${this.apiUrl}`);
  }
}
