import { Injectable } from '@angular/core';
import { Video } from '../components/interfaces/videos';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private apiUrl: string = environment.videoUrl;

  constructor(private _http: HttpClient, private _storageService: StorageService) { }

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
}
