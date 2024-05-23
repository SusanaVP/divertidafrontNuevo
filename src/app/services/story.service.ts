import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Stories } from '../components/interfaces/stories';
import { CategoryStory } from '../components/interfaces/categoryStory';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  private apiUrl: string = environment.storyUrl;

  constructor(private _http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

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
    
    async addStory(story: Stories): Promise<string> {
      try {
        const response: HttpResponse<string> | undefined = await this._http.post<string>(
          `${this.apiUrl}/addStory`, story, { headers: this.getHeaders(), observe: 'response' }).toPromise();
        if (response && response?.status === 200) {
          return 'success';
        } else {
          console.log('Error al guardar el cuento:', response);
          return 'error';
        }
      } catch (error) {
        console.error('Error al procesar la solicitud del cuento:', error);
        return 'error';
      }
    }
  
    async deleteStory(idStory: number): Promise<string> {
      try {
        const response: string | undefined = await this._http.get(`${this.apiUrl}/deleteStory/${idStory}`, { headers: this.getHeaders(), responseType: 'text' }).toPromise();
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

    async updateStory(story: Stories): Promise<string> {
      try {
        const response: HttpResponse<string> | undefined = await this._http.put<string>(
          `${this.apiUrl}/updateStory/${story.id}`, story, { headers: this.getHeaders(), observe: 'response' }).toPromise();
        if (response && response?.status === 200) {
          return 'success';
        } else {
          console.log('Error al actualizar el cuento:', response);
          return 'error';
        }
      } catch (error) {
        console.error('Error al procesar la solicitud del cuento:', error);
        return 'error';
      }
    }

    async getStoryCategories(): Promise<CategoryStory[]> {
      try {
        const result = await this._http.get<CategoryStory[]>(`${this.apiUrl}/storyCategories`, { headers: this.getHeaders() }).toPromise();
        if (result?.length === 0 || result === undefined || result === null) {
          console.error('La respuesta del servidor es indefinida.');
          return [];
        }
        return result;
      } catch (error) {
        console.error('Error al obtener las categorías de los cuentos', error);
        return [];
      }
    }
}
