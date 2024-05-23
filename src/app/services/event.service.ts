import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEvents(): Observable<Event[]> {
    return this._http.get<Event[]>(`${this.apiUrl}`);
  }

  async addEvent(event: Event): Promise<string> {
    try {
      const response: HttpResponse<string> | undefined = await this._http.post<string>(
        `${this.apiUrl}/addEvent`, event, { headers: this.getHeaders(), observe: 'response' }).toPromise();
      if (response && response?.status === 200) {
        return 'success';
      } else {
        console.log('Error al guardar el evento:', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al procesar la solicitud del evento:', error);
      return 'error';
    }
  }

  async deleteEvent(idEvent: number): Promise<string> {
    try {
      const response: string | undefined = await this._http.get(`${this.apiUrl}/deleteEvent/${idEvent}`, { headers: this.getHeaders(), responseType: 'text' }).toPromise();
      if (response === '') {
        return 'success';
      } else {
        console.log('Error al eliminar el evento', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al eliminar el evento.', error);
      return 'error';
    }
  }
}
