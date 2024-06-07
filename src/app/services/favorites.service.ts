import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Video } from '../components/interfaces/videos';
import { Favorites } from '../components/interfaces/favorites';
import { Stories } from '../components/interfaces/stories';
import { Riddles } from '../components/interfaces/riddles';
import { Event } from '../components/interfaces/events';
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private apiUrl: string = environment.favoritesUrl;

  constructor(private _http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async addFavorite(contentId: number, idUser: number, contentType: string) {
    try {
      await this._http.get<void>(`${this.apiUrl}/addFavorite/${contentId}/${idUser}/${contentType}`, { headers: this.getHeaders() }).toPromise();
      console.log('Agregado a favoritos correctamente');
    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
    }
  }

  async deleteFavorite(contentId: number, idUser: number, contentType: string) {
    try {
      await this._http.get<void>(`${this.apiUrl}/deleteFavorite/${contentId}/${idUser}/${contentType}`, { headers: this.getHeaders() }).toPromise();
      console.log('Eliminado de favoritos correctamente');
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
    }
  }

  async getFavoritesVideos(idUser: number): Promise<Video[]> {
    try {
      const result = await this._http.get<Video[]>(`${this.apiUrl}/favoritesVideos/${idUser}`, { headers: this.getHeaders() }).toPromise();

      if (result === undefined || result === null) {
        console.log('La respuesta del servidor es indefinida para los vídeos favoritos.');
        return [];
      } else if (result?.length === 0) {
        return [];
      }
      return result;
    } catch (error) {
      console.error('Error al obtener los videos favoritos:', error);
      return [];
    }
  }

  async getFavoritesStories(idUser: number): Promise<Stories[]> {
    try {
      const result = await this._http.get<Stories[]>(`${this.apiUrl}/favoritesStories/${idUser}`, { headers: this.getHeaders() }).toPromise();

      if (result === undefined || result === null) {
        console.log('La respuesta del servidor es indefinida para los cuentos favoritos.');
        return [];
      } else if (result?.length === 0) {
        return [];
      }
      return result;
    } catch (error) {
      console.error('Error al obtener los cuentos favoritos:', error);
      return [];
    }
  }

  async getFavoritesRiddles(idUser: number): Promise<Riddles[]> {
    try {
      const result = await this._http.get<Riddles[]>(`${this.apiUrl}/favoritesRiddles/${idUser}`, { headers: this.getHeaders() }).toPromise();

      if (result === undefined || result === null) {
        console.log('La respuesta del servidor es indefinida para las adivinanzas favoritas.');
        return [];
      } else if (result?.length === 0) {
        return [];
      }
      return result;
    } catch (error) {
      console.error('Error al obtener las adivinanzas favoritos:', error);
      return [];
    }
  }

  async getFavoritesEvents(idUser: number): Promise<Event[]> {
    try {
      const result = await this._http.get<Event[]>(`${this.apiUrl}/favoritesEvents/${idUser}`, { headers: this.getHeaders() }).toPromise();

      if (result === undefined || result === null) {
        console.log('La respuesta del servidor es indefinida para los eventos favoritos.');
        return [];
      } else if (result?.length === 0) {
        return [];
      }
      return result;
    } catch (error) {
      console.error('Error al obtener los eventos favoritos:', error);
      return [];
    }
  }

  getFavoritesIdUser(idUser: number) {
    return this._http.get<Favorites[]>(`${this.apiUrl}/favoritesIdUser/${idUser}`, { headers: this.getHeaders() });
  }
}
