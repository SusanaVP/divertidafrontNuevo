import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../components/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl: string = environment.userUrl;

  constructor(private _http: HttpClient) { }

  async userDataSave(user: User): Promise<string> {
      const url = `${this.apiUrl}/saveUser`;
      try {
          const response: HttpResponse<string> | undefined = await this._http.post<string>(url, user, { observe: 'response' }).toPromise();

          if (response && response?.status === 200) {
              return 'success';
          } else {
              console.error('Error al guardar el usuario:', response);
              return 'error';
          }
      } catch (error) {
          console.error('Error al guardar el usuario:', error);
          return 'error';
      }
  }

  async getUserById(id: number): Promise<User> {
      const url = `${this.apiUrl}/getUser/${id}`;
      const result = await this._http.get<User>(url).toPromise();
      return result!;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
      const url = `${this.apiUrl}/findByEmail?email=${email}`;
      try {
          const result: User | undefined = await this._http.get<User>(url).toPromise();

          console.log(result); 
          if (result === undefined) {
              console.error('La respuesta del servidor es indefinida.');
              return undefined;
          }
          return result;
      } catch (error) {
          console.error('Error al obtener el usuario por email:', error);
          return undefined;
      }
  }
}
