import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setToken(jwtToken: string) {
    sessionStorage.setItem('token', jwtToken);
  }

  public getToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (token !== null) {
      return token;
    } else {
      return null;
    }
  }

  public removeUser() {
    sessionStorage.removeItem('token');
  }
}
