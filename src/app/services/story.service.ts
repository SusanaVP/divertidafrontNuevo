import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Stories } from '../components/interfaces/stories';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  private apiUrl: string = environment.storyUrl;

  constructor(private _http: HttpClient) { }

  getStory(): Observable<Stories[]> {
    return this._http.get<Stories[]>(this.apiUrl);
  }

  async getStoriesByCategory(categoryId: number): Promise<Stories[]> {
    try {
      const result = await this._http.get<Stories[]>(`${this.apiUrl}/storiesByCategory/${categoryId}`).toPromise();

      if (result?.length === 0 || result === undefined || result === null) {
        console.error('La respuesta del servidor es indefinida.');
        return [];
      }

      return result;
    } catch (error) {
      console.error('Error al obtener los cuentos de la categoría ${category}', error);
      return [];
    }
  }
}
