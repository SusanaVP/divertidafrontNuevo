import { Injectable } from '@angular/core';
import { Riddles } from '../components/interfaces/riddles';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiddleService {
  private apiUrl: string = environment.riddlesUrl;

  constructor(private _http: HttpClient) { }

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
}
