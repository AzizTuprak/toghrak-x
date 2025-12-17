import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'nb_token';
  private loggedIn$ = new BehaviorSubject<boolean>(!!this.getToken());

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${environment.apiBaseUrl}/auth/login`,
        payload,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          this.clearToken();
          this.setToken(res.token);
        })
      );
  }

  logout(): void {
    this.clearToken();
    // clear refresh cookie on backend
    this.http
      .post(`${environment.apiBaseUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({ next: () => {}, error: () => {} });
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn$.next(true);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
  }
}
