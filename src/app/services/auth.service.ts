import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import * as jwt_decode from 'jwt-decode';
import { JwtResponse } from '../components/interfaces/JwtResponse';
import { DecodedToken } from '../components/interfaces/decodeToken';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn: Observable<boolean> = this.isLoggedInSubject.asObservable();
  private isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAdmin: Observable<boolean> = this.isAdminSubject.asObservable();
  private apiUrl: string = environment.userUrl;

  constructor(private http: HttpClient, private _storageService: StorageService) { }

  login(email: string, password: string): Promise<DecodedToken> {
    return new Promise<DecodedToken>((resolve, reject) => {
      this.http.post<JwtResponse>(`${this.apiUrl}/login`, { email, password }).subscribe(
        response => {
          if (response && response.jwtToken) {
            this._storageService.setToken(response.jwtToken);
            const decodedToken = this.decodeJwtToken(response.jwtToken);
            this.isLoggedInSubject.next(true);
            resolve(decodedToken);
          } else {
            reject(new Error('Token not found in response'));
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  decodeJwtToken(token: string): DecodedToken {
    const decoded: any = jwtDecode(token);
    return { email: decoded.name, isAdmin: decoded.isAdmin };
  }

  logout(): void {
    this._storageService.removeUser();
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }
}
