import { Injectable } from '@angular/core';
import { Riddles } from '../components/interfaces/riddles';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { CategoryRiddle } from '../components/interfaces/categoryRiddle';

@Injectable({
  providedIn: 'root'
})
export class RiddleService {
  private apiUrl: string = environment.riddlesUrl;

  constructor(private _http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRiddles(): Observable<Riddles[]> {
    return this._http.get<Riddles[]>(this.apiUrl);
  }

  async getRiddlesByCategory(categoryId: number): Promise<Riddles[]> {
    try {
      const result = await this._http.get<Riddles[]>(`${this.apiUrl}/riddlesByCategory/${categoryId}`).toPromise();

      if (result?.length === 0 || result === undefined || result === null) {
        console.error('La respuesta del servidor es indefinida.');
        return [];
      }

      return result;
    } catch (error) {
      console.error('Error al obtener las adivinanzas de la categoría ${category}', error);
      return [];
    }
  }

  
  async addRiddle(riddle: Riddles): Promise<string> {
    try {
      const response: HttpResponse<string> | undefined = await this._http.post<string>(
        `${this.apiUrl}/addRiddle`, riddle, { headers: this.getHeaders(), observe: 'response' }).toPromise();
      if (response && response?.status === 200) {
        return 'success';
      } else {
        console.log('Error al guardar la adivinanza:', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al procesar la solicitud de la adivinanza:', error);
      return 'error';
    }
  }

  async deleteRiddle(idRiddle: number): Promise<string> {
    try {
      const response: string | undefined = await this._http.get(`${this.apiUrl}/deleteRiddle/${idRiddle}`, { headers: this.getHeaders(), responseType: 'text' }).toPromise();
      if (response === '') {
        return 'success';
      } else {
        console.log('Error al eliminar la adivinanza', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al eliminar la adivinanza.', error);
      return 'error';
    }
  }

  async getRiddleCategories(): Promise<CategoryRiddle[]> {
    try {
      const result = await this._http.get<CategoryRiddle[]>(`${this.apiUrl}/riddleCategories`, { headers: this.getHeaders() }).toPromise();
      if (result?.length === 0 || result === undefined || result === null) {
        console.error('La respuesta del servidor es indefinida.');
        return [];
      }
      return result;
    } catch (error) {
      console.error('Error al obtener las categorías de las adivinanzas', error);
      return [];
    }
  }
}
