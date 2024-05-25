import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  
  private isSessionStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public setToken(jwtToken: string) {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem('token', jwtToken);
    } else {

      console.warn('SessionStorage no está disponible');
    }
  }

  public getToken(): string | null {
    if (this.isSessionStorageAvailable()) {
      return sessionStorage.getItem('token');
    } else {
      console.warn('SessionStorage no está disponible');
      return null;
    }
  }

  public removeUser() {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem('token');
    } else {
      console.warn('SessionStorage no está disponible');
    }
  }

  // Métodos para el localStorage
  public setLocalStorageItem(key: string, value: string) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    } else {
      console.warn('localStorage is not available');
    }
  }

  public getLocalStorageItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    } else {
      console.warn('localStorage is not available');
      return null;
    }
  }

  public removeLocalStorageItem(key: string) {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      console.warn('localStorage is not available');
    }
  }
}
