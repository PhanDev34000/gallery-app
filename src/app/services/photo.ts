import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'http://localhost:3000/api/photos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  uploadPhotos(galleryId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    return this.http.post(`${this.apiUrl}/${galleryId}`, formData, { headers: this.getHeaders() });
  }

  toggleFavorite(photoId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${photoId}/favorite`, {});
  }

  downloadFavoritesZip(galleryId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${galleryId}/favorites/zip`, {
      responseType: 'blob'
    });
  }
}