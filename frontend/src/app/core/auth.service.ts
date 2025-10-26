import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from './models';

const TOKEN_KEY = 'nb_token';
const ROLE_KEY = 'nb_role';
const NAME_KEY = 'nb_name';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/auth`;

  login(req: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/login`, req);
  }
  register(data: { username: string; email: string; password: string }) {
    return this.http.post(`${this.base}/register`, data);
  }
  saveSession(res: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(ROLE_KEY, res.role);
    localStorage.setItem(NAME_KEY, res.username);
  }
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
  }
  get token() {
    return localStorage.getItem(TOKEN_KEY);
  }
  get role() {
    return localStorage.getItem(ROLE_KEY);
  }
  get isAuthenticated() {
    return !!this.token;
  }
}
