import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { SocialLink } from '../models/social-link';

@Injectable({ providedIn: 'root' })
export class SocialLinksService {
  private base = `${environment.apiBaseUrl}/social-links`;
  private subject = new BehaviorSubject<SocialLink[]>([]);
  links$ = this.subject.asObservable();

  constructor(private http: HttpClient) {}

  load() {
    this.http.get<SocialLink[]>(this.base).subscribe({
      next: (links) => this.subject.next(links),
      error: () => this.subject.next([]),
    });
  }

  create(payload: SocialLink): Observable<SocialLink> {
    return this.http.post<SocialLink>(this.base, payload).pipe(tap(() => this.load()));
  }

  update(id: number, payload: SocialLink): Observable<SocialLink> {
    return this.http.put<SocialLink>(`${this.base}/${id}`, payload).pipe(tap(() => this.load()));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(tap(() => this.load()));
  }
}
