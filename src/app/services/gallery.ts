import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = 'https://gallery-api-kwcx.onrender.com/api/galleries';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getGalleries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createGallery(name: string, date: string): Observable<any> {
    return this.http.post(this.apiUrl, { name, date }, { headers: this.getHeaders() });
  }

  deleteGallery(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  setPassword(galleryId: string, password: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${galleryId}/password`, 
      { password }, 
      { headers: this.getHeaders() }
    );
  }

  removePassword(galleryId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${galleryId}/password`, 
      { password: null }, 
      { headers: this.getHeaders() }
    );
  }

  getPublicGallery(uniqueUrl: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/${uniqueUrl}`);
  }

  verifyPassword(uniqueUrl: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/public/${uniqueUrl}/verify`, { password });
  }
}