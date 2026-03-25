import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_ck5f88r';
  private templateId = 'template_5n9zr6h';
  private publicKey = 'kr31gPuIg3aQPpTmo';

  sendGalleryLink(galleryId: string, clientEmail: string, clientName: string, galleryName: string, uniqueUrl: string): Observable<any> {
    const galleryLink = `https://gallery-app-five-iota.vercel.app/g/${uniqueUrl}`;

    return from(emailjs.send(
      this.serviceId,
      this.templateId,
      {
        client_name: clientName,
        client_email: clientEmail,
        gallery_name: galleryName,
        gallery_link: galleryLink
      },
      this.publicKey
    ));
  }
}