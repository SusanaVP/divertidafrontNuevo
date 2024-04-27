import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Blog } from '../components/interfaces/blog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl: string = environment.blogUrl;

  constructor(private _http: HttpClient) { }

  getBlog(): Observable<Blog[]> {
    return this._http.get<Blog[]>(`${this.apiUrl}`);
  }

  async addBlogEntry(blogEntryData: Blog): Promise<string> {
    const url = `${this.apiUrl}/addBlog`;
    const response: HttpResponse<string> | undefined = await this._http.post<string>(url, blogEntryData, { observe: 'response' }).toPromise();

    if (response && response?.status === 200) {
      return 'success';
    } else {
      console.error('Error al guardar el usuario:', response);
      return 'error';
    }
  }

  async likePlus(idBlog: number): Promise<string> {
    const url = `${this.apiUrl}/likesBlog/${idBlog}`;
    const response: string | undefined = await this._http.get(url, { responseType: 'text' }).toPromise();
    return response!;
  }

  // onUpload(): void {
  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile);
  
  //   this._http.post('URL_DEL_SERVIDOR', formData)
  //     .subscribe(response => {
  //       // Maneja la respuesta del servidor si es necesario
  //     });
  // }
}
