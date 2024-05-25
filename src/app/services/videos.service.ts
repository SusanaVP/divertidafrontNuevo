import { Injectable } from '@angular/core';
import { Video } from '../components/interfaces/videos';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { CategoryVideo } from '../components/interfaces/categoryVideo';


@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private apiUrl: string = environment.videoUrl;

  constructor(private _http: HttpClient, private _storageService: StorageService) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
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

      if (result === undefined || result === null) {
        console.error('La respuesta del servidor es indefinida para las categorías de los vídeos.');
        return [];
      } else if (result?.length === 0) {
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

  async getVideoCategories(): Promise<CategoryVideo[]> {
    try {
      const result = await this._http.get<CategoryVideo[]>(`${this.apiUrl}/videoCategories`, { headers: this.getHeaders() }).toPromise();
      if (result === undefined || result === null) {
        console.error('La respuesta del servidor es indefinida para las categorías de los vídeos.');
        return [];
      } else if (result?.length === 0) {
        return [];
      }
      return result;
    } catch (error) {
      console.error('Error al obtener las categorías de los vídeos', error);
      return [];
    }
  }

  async addVideo(video: Video): Promise<string> {
    try {
      const response: HttpResponse<string> | undefined = await this._http.post<string>(`${this.apiUrl}/addVideo`, video, { headers: this.getHeaders(), observe: 'response' }).toPromise();

      if (response && response?.status === 200) {
        return 'success';
      } else {
        console.error('Error al guardarel vídeo:', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al guardar el vídeo:', error);
      return 'error';
    }
  }

  async deleteVideo(idVideo: number): Promise<string> {
    try {
      const response: string | undefined = await this._http.get(`${this.apiUrl}/deleteVideo/${idVideo}`, { headers: this.getHeaders(), responseType: 'text' }).toPromise();
      if (response === '') {
        return 'success';
      } else {
        console.log('Error al eliminar el vídeo', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al eliminar el vídeo.', error);
      return 'error';
    }
  }

}
