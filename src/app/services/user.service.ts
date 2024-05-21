import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from '../components/interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl: string = environment.userUrl;

    constructor(private _http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = sessionStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    async userDataSave(user: User): Promise<string> {
        try {
            const response: HttpResponse<string> | undefined = await this._http.post<string>(`${this.apiUrl}/register`, user, { observe: 'response' }).toPromise();

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
        const result = await this._http.get<User>(`${this.apiUrl}/getUser/${id}`, { headers: this.getHeaders() }).toPromise();
        return result!;
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        try {
            const result: User | undefined = await this._http.get<User>(`${this.apiUrl}/findByEmail?email=${email}`).toPromise();
            console.log(result);
            if (!result) {
                console.log('No se encontró ningún usuario con el correo electrónico proporcionado.');
                return undefined;
            }
            return result;
        } catch (error) {
            console.error('Error al obtener el usuario por email:', error);
            return undefined;
        }
    }
}
