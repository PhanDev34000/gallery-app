import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/api/email';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  sendGalleryLink(galleryId: string, clientEmail: string, clientName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, 
      { galleryId, clientEmail, clientName },
      { headers: this.getHeaders() }
    );
  }
}