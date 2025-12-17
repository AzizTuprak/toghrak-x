import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContentPage, UpsertContentPageRequest } from '../models/content-page';

@Injectable({ providedIn: 'root' })
export class PageService {
  private base = `${environment.apiBaseUrl}/pages`;
  private pagesSubject = new BehaviorSubject<ContentPage[]>([]);
  pages$ = this.pagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  load(): void {
    this.list().subscribe({
      next: (pages) => this.pagesSubject.next(pages),
      error: () => this.pagesSubject.next([]),
    });
  }

  get(slug: string): Observable<ContentPage> {
    return this.http.get<ContentPage>(`${this.base}/${slug}`);
  }

  list(): Observable<ContentPage[]> {
    return this.http.get<ContentPage[]>(this.base);
  }

  create(payload: UpsertContentPageRequest): Observable<ContentPage> {
    return this.http.post<ContentPage>(this.base, payload).pipe(tap(() => this.load()));
  }

  update(slug: string, payload: UpsertContentPageRequest): Observable<ContentPage> {
    return this.http.put<ContentPage>(`${this.base}/${slug}`, payload).pipe(tap(() => this.load()));
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${slug}`).pipe(tap(() => this.load()));
  }
}
