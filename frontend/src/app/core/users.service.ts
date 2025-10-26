import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Page, User } from './models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/users`;
  list(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<User>>(this.base, { params });
  }
  remove(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
