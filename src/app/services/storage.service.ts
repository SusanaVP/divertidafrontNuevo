import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
 constructor() {
    // No necesitas inicializar nada en el constructor
  }

  public setUserId(key: string, id: number) {
    localStorage.setItem(key, id.toString());
  }

  public getUserId(key: string): number | null {
    const userIdString = localStorage.getItem(key);
    if (userIdString !== null) {
      return parseInt(userIdString, 10);
    } else {
      return null;
    }
  }

  public removeUserId(key: string) {
    localStorage.removeItem(key);
  }
}
