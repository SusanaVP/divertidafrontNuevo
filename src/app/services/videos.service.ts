import { Injectable } from '@angular/core';
import { Video } from '../components/interfaces/videos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private apiUrl: string = environment.videoUrl;

  constructor(private _http: HttpClient, private _storageService: StorageService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVideos(): Observable<Video[]> {
    return this._http.get<Video[]>(this.apiUrl);
  }

  getRecommendedVideos() {
    return this._http.get<Video[]>(`${this.apiUrl}/recommended`);
  }

  async getVideosByCategories(category: string): Promise<Video[]> {
    try {
      const result = await this._http.get<Video[]>(`${this.apiUrl}/categories/${category}`).toPromise();

      if (result?.length === 0 || result === undefined || result === null) {
        console.error('La respuesta del servidor es indefinida.');
        return [];
      }

      return result;
    } catch (error) {
      console.error('Error al obtener las categorías de las manualidades', error);
      return [];
    }
  }


  async deleteRecommendedVideo(idVideo: number): Promise<string> {
    try {
      const response = await this._http.get<string>(`${this.apiUrl}/deleteRecommended/${idVideo}`, { headers: this.getHeaders(), responseType: 'text' as 'json' }).toPromise();
      return response!;
    } catch (error) {
      console.error('Error al eliminar el video de la lista de recomendados', error);
      return 'error';
    }
  }

  async addRecommendedVideo(idVideo: number): Promise<string> {
    try {
      const response = await this._http.get<string>(`${this.apiUrl}/addRecommended/${idVideo}`, { headers: this.getHeaders(), responseType: 'text' as 'json' }).toPromise();
      return response!;
    } catch (error) {
      console.error('Error al añadir el video a la lista de recomendados', error);
      return 'error';
    }
  }
}
