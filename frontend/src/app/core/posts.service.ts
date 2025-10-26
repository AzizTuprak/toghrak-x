import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Page, PostDetail, PostSummary } from './models';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/posts`;

  list(page = 0, size = environment.pageSizeDefault, categorySlug?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (categorySlug) params = params.set('category', categorySlug);
    return this.http.get<Page<PostSummary>>(this.base, { params });
  }
  bySlug(slug: string) {
    return this.http.get<PostDetail>(`${this.base}/slug/${slug}`);
  }
  create(payload: FormData) {
    return this.http.post<PostDetail>(this.base, payload);
  }
  update(id: number, payload: FormData) {
    return this.http.put<PostDetail>(`${this.base}/${id}`, payload);
  }
  remove(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
