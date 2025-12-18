import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ImageUploadResponse {
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private base = `${environment.apiBaseUrl}/images/upload`;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageUploadResponse>(this.base, formData);
  }
}
