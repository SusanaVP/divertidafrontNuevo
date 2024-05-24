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

  // Métodos para el localStorage
  public setLocalStorageItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getLocalStorageItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public removeLocalStorageItem(key: string) {
    localStorage.removeItem(key);
  }
}
