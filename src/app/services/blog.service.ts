import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Blog } from '../components/interfaces/blog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl: string = environment.blogUrl;

  constructor(private _http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBlog(): Observable<Blog[]> {
    return this._http.get<Blog[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getBlogValidated(): Observable<Blog[]> {
    return this._http.get<Blog[]>(`${this.apiUrl}/blogValidated`, { headers: this.getHeaders() });
  }

  getBlogNoValidated(): Observable<Blog[]> {
    return this._http.get<Blog[]>(`${this.apiUrl}/blogNoValidated`, { headers: this.getHeaders() });
  }

  async addBlogEntry(blogEntryData: Blog): Promise<string> {
    try {
      const response: HttpResponse<string> | undefined = await this._http.post<string>(
        `${this.apiUrl}/addBlog`, blogEntryData, { headers: this.getHeaders(), observe: 'response' }).toPromise();
      if (response && response?.status === 200) {
        return 'success';
      } else {
        console.error('Error al guardar el usuario:', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      return 'error';
    }
  }

  async likePlus(idBlog: number): Promise<string> {
    const response: string | undefined = await this._http.get(`${this.apiUrl}/likesBlog/${idBlog}`, { responseType: 'text' }).toPromise();
    return response!;
  }

  async editValidation(idBlog: number): Promise<string> {
    const response: string | undefined = await this._http.get(`${this.apiUrl}/editValidation/${idBlog}`, { responseType: 'text' }).toPromise();
    return response!;
  }
}
