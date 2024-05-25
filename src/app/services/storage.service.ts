import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  
  private isSessionStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  public setToken(jwtToken: string) {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem('token', jwtToken);
    } else {
      console.error('SessionStorage no está disponible');
    }
  }

  public getToken(): string | null {
    if (this.isSessionStorageAvailable()) {
      return sessionStorage.getItem('token');
    } else {
      console.error('SessionStorage no está disponible');
      return null;
    }
  }

  public removeUser() {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem('token');
    } else {
      console.error('SessionStorage no está disponible');
    }
  }

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
