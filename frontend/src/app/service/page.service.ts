import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContentPage, UpsertContentPageRequest } from '../models/content-page';

@Injectable({ providedIn: 'root' })
export class PageService {
  private base = `${environment.apiBaseUrl}/pages`;

  constructor(private http: HttpClient) {}

  get(slug: string): Observable<ContentPage> {
    return this.http.get<ContentPage>(`${this.base}/${slug}`);
  }

  list(): Observable<ContentPage[]> {
    return this.http.get<ContentPage[]>(this.base);
  }

  create(payload: UpsertContentPageRequest): Observable<ContentPage> {
    return this.http.post<ContentPage>(this.base, payload);
  }

  update(slug: string, payload: UpsertContentPageRequest): Observable<ContentPage> {
    return this.http.put<ContentPage>(`${this.base}/${slug}`, payload);
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${slug}`);
  }
}
