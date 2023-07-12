import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode'
import { TokenInterface } from 'src/Interfaces/TokenInterface';


@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey: string = 'token';

  constructor(private router: Router) {}

  getToken(): string {
    const token = localStorage.getItem(this.tokenKey);
    return token !== null ? token : '';
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    var isValid = false;

    if (!token) {
      return isValid;
    }

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp;
      const currentTime = new Date().getTime();
      if (currentTime >= expirationTime) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    return isValid;
  }

  canActivate(): boolean {
    if (!this.isTokenValid()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  redirectIfNotValid(page: string): void {
    if (!this.isTokenValid()) {
      this.removeToken();
      this.router.navigate([page]);
    }
  }

  redirectIfValid(page: string): void {
    if (this.isTokenValid()) {
      this.router.navigate([page]);
    }
  }

  getRole(): string {
    return jwtDecode<TokenInterface>(this.getToken()).role;
  }
}
