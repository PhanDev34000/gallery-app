import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { GalleryService } from '../../services/gallery';
import { AuthService } from '../../services/auth';
import { EmailService } from '../../services/email';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, MatInputModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  galleries: any[] = [];
  user: any;
  emailData: { [key: string]: { clientName: string, clientEmail: string } } = {};
  emailStatus: { [key: string]: string } = {};
  passwordData: { [key: string]: string } = {};
  showPasswordForm: { [key: string]: boolean } = {};
  passwordStatus: { [key: string]: string } = {};
  showEmailForm: { [key: string]: boolean } = {};

  constructor(
    private galleryService: GalleryService,
    private authService: AuthService,
    private emailService: EmailService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadGalleries();
  }

  loadGalleries() {
    this.galleryService.getGalleries().subscribe({
      next: (galleries) => {
        this.galleries = [...galleries];
        this.galleries.forEach(g => {
          this.showEmailForm[g._id] = false;
          this.emailData[g._id] = { clientName: '', clientEmail: '' };
          this.passwordData[g._id] = '';
          this.showPasswordForm[g._id] = false;
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement galeries', err)
    });
  }

  createGallery() {
    this.router.navigate(['/gallery/create']);
  }

  uploadPhotos(galleryId: string) {
    this.router.navigate(['/gallery', galleryId, 'upload']);
  }

  copyLink(uniqueUrl: string) {
    const link = `${window.location.origin}/g/${uniqueUrl}`;
    navigator.clipboard.writeText(link);
    alert('Lien copié ! 🎉');
  }

  sendEmail(galleryId: string) {
  const data = this.emailData[galleryId];
  if (!data.clientEmail || !data.clientName) {
    this.emailStatus[galleryId] = 'Veuillez remplir le nom et l\'email du client';
    return;
  }

  const gallery = this.galleries.find(g => g._id === galleryId);

  this.emailStatus[galleryId] = 'Envoi en cours...';
  this.emailService.sendGalleryLink(
    galleryId,
    data.clientEmail,
    data.clientName,
    gallery.name,
    gallery.uniqueUrl
  ).subscribe({
    next: () => {
      this.emailStatus[galleryId] = '✅ Email envoyé avec succès !';
      this.emailData[galleryId] = { clientName: '', clientEmail: '' };
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.emailStatus[galleryId] = '❌ Erreur : ' + err.message;
      this.cdr.detectChanges();
    }
  });
}

  deleteGallery(id: string) {
    if (confirm('Supprimer cette galerie ?')) {
      this.galleryService.deleteGallery(id).subscribe({
        next: () => this.loadGalleries(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openPasswordDialog(gallery: any) {
    this.showPasswordForm[gallery._id] = !this.showPasswordForm[gallery._id];
    this.cdr.detectChanges();
  }

  setPassword(galleryId: string) {
    const password = this.passwordData[galleryId];
    this.galleryService.setPassword(galleryId, password).subscribe({
      next: () => {
        this.passwordStatus[galleryId] = '✅ Mot de passe défini !';
        this.passwordData[galleryId] = '';
        this.showPasswordForm[galleryId] = false;
        this.loadGalleries();
      },
      error: (err) => {
        this.passwordStatus[galleryId] = '❌ Erreur : ' + err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  removePassword(galleryId: string) {
    if (confirm('Supprimer la protection par mot de passe ?')) {
      this.galleryService.removePassword(galleryId).subscribe({
        next: () => {
          this.passwordStatus[galleryId] = '✅ Protection supprimée !';
          this.loadGalleries();
        },
        error: (err) => {
          this.passwordStatus[galleryId] = '❌ Erreur : ' + err.error.message;
          this.cdr.detectChanges();
        }
      });
    }
  }
}