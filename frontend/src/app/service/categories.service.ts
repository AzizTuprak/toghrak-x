import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private base = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  get(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }
}
