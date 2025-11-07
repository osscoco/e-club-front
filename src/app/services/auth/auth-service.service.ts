import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authState.next(true);
    }
  }

  login() {
    this.authState.next(true);
  }

  logout() {
    this.authState.next(false);
    localStorage.removeItem('token');
  }

  get isAuthenticated(): boolean {
    return this.authState.value;
  }
}