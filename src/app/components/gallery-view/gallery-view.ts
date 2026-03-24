import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { GalleryService } from '../../services/gallery';
import { PhotoService } from '../../services/photo';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-gallery-view',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, 
            MatToolbarModule, MatChipsModule, MatInputModule],
  templateUrl: './gallery-view.html',
  styleUrl: './gallery-view.css'
})
export class GalleryView implements OnInit {
  gallery: any = null;
  photos: any[] = [];
  selectedPhoto: any = null;
  selectedIndex: number = 0;

  // Protection par mot de passe
  isProtected: boolean = false;
  passwordInput: string = '';
  passwordError: string = '';
  uniqueUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private galleryService: GalleryService,
    private photoService: PhotoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.uniqueUrl = this.route.snapshot.paramMap.get('uniqueUrl') || '';
    this.loadGallery(this.uniqueUrl);
  }

  loadGallery(uniqueUrl: string) {
    this.galleryService.getPublicGallery(uniqueUrl).subscribe({
      next: (data) => {
        if (data.gallery.isProtected && data.photos.length === 0) {
          this.isProtected = true;
          this.gallery = data.gallery;
        } else {
          this.gallery = data.gallery;
          this.photos = data.photos;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement galerie', err)
    });
  }

  verifyPassword() {
    if (!this.passwordInput) {
      this.passwordError = 'Veuillez entrer le mot de passe';
      return;
    }

    this.galleryService.verifyPassword(this.uniqueUrl, this.passwordInput).subscribe({
      next: (data) => {
        this.isProtected = false;
        this.gallery = data.gallery;
        this.photos = data.photos;
        this.passwordError = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.passwordError = 'Mot de passe incorrect ❌';
        this.cdr.detectChanges();
      }
    });
  }

  toggleFavorite(photo: any) {
    this.photoService.toggleFavorite(photo._id).subscribe({
      next: (updatedPhoto) => {
        const index = this.photos.findIndex(p => p._id === photo._id);
        if (index !== -1) {
          this.photos[index] = updatedPhoto;
          this.photos = [...this.photos];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erreur toggle favori', err)
    });
  }

  openLightbox(photo: any, index: number) {
    this.selectedPhoto = photo;
    this.selectedIndex = index;
  }

  closeLightbox() {
    this.selectedPhoto = null;
  }

  prevPhoto() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.selectedPhoto = this.photos[this.selectedIndex];
    }
  }

  nextPhoto() {
    if (this.selectedIndex < this.photos.length - 1) {
      this.selectedIndex++;
      this.selectedPhoto = this.photos[this.selectedIndex];
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  get favoriteCount(): number {
    return this.photos.filter(p => p.isFavorite).length;
  }

  downloadZip() {
  if (this.favoriteCount === 0) {
    alert('Aucune photo favorite à télécharger !');
    return;
  }

  this.photoService.downloadFavoritesZip(this.gallery._id).subscribe({
    next: (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.gallery.name}-favoris.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    error: (err) => console.error('Erreur téléchargement ZIP', err)
  });
}
}