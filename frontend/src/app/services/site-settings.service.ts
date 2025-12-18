import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { SiteSettings } from '../models/site-settings';

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private base = `${environment.apiBaseUrl}/site-settings`;
  private settingsSubject = new BehaviorSubject<SiteSettings | null>(null);
  settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient) {}

  load() {
    this.http.get<SiteSettings>(this.base).subscribe({
      next: (res) => this.settingsSubject.next(res),
      error: () => this.settingsSubject.next(null),
    });
  }

  update(body: Partial<SiteSettings>) {
    return this.http.put<SiteSettings>(this.base, body).pipe(
      tap((res) => this.settingsSubject.next(res))
    );
  }

  current(): SiteSettings | null {
    return this.settingsSubject.value;
  }
}
