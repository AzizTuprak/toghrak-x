import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, distinctUntilChanged, finalize, map, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refresh$?: Observable<LoginResponse>;

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
    return this.tokenSubject.asObservable().pipe(
      map((t) => !!t),
      distinctUntilChanged()
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  refresh(): Observable<LoginResponse> {
    if (!this.refresh$) {
      this.refresh$ = this.http
        .post<LoginResponse>(`${environment.apiBaseUrl}/auth/refresh`, {}, { withCredentials: true })
        .pipe(
          tap((res) => this.setToken(res.token)),
          finalize(() => {
            this.refresh$ = undefined;
          }),
          shareReplay(1)
        );
    }
    return this.refresh$;
  }

  ensureToken(): Observable<string> {
    const existing = this.getToken();
    if (existing) return of(existing);

    return this.refresh().pipe(map((res) => res.token));
  }

  private setToken(token: string) {
    this.tokenSubject.next(token);
  }

  clearToken(): void {
    this.tokenSubject.next(null);
  }
}
