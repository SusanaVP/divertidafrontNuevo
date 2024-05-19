import { Injectable } from '@angular/core';
import { JwtResponse } from '../components/interfaces/JwtResponse';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  [x: string]: any;
  private userIdKey = 'loggedInUserId';

  constructor() {}

  public setToken(jwtToken: string){
    localStorage.setItem('token', jwtToken);
  }

  public getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token !== null) {
      return token;
    } else {
      return null;
    }
  }

  public removeUser() {
    localStorage.removeItem(this.userIdKey);
  }
}
