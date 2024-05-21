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
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBlog(): Observable<Blog[]> {
    return this._http.get<Blog[]>(`${this.apiUrl}`);
  }

  getBlogValidated(): Observable<Blog[]> {
    return this._http.get<Blog[]>(`${this.apiUrl}/blogValidated`);
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
        console.log('Error al guardar el usuario:', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      return 'error';
    }
  }

  async likePlus(idBlog: number): Promise<string> {
    try {
      const response: string | undefined = await this._http.get(`${this.apiUrl}/likesBlog/${idBlog}`, { headers: this.getHeaders(), responseType: 'text' }).toPromise();
      if (response) {
        return 'success';
      } else {
        console.log('Error al dar like al blog', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al dar like al blog.', error);
      return 'error';
    }
  }

  async editValidation(idBlog: number): Promise<string> {
    try {
      const response: string | undefined = await this._http.get(`${this.apiUrl}/editValidation/${idBlog}`, { headers: this.getHeaders(), responseType: 'text' }).toPromise();
      if (response) {
        return 'success';
      } else {
        console.log('Error validar el blog', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al validar el blog.', error);
      return 'error';
    }
  }

  async deleteBlog(idBlog: number): Promise<string> {
    try {
      const response: string | undefined = await this._http.get(`${this.apiUrl}/deleteBlog/${idBlog}`, { headers: this.getHeaders(), responseType: 'text' }).toPromise();
      if (response === '') {
        return 'success';
      } else {
        console.log('Error al eliminar el blog', response);
        return 'error';
      }
    } catch (error) {
      console.error('Error al eliminar el blog.', error);
      return 'error';
    }
  }
}
