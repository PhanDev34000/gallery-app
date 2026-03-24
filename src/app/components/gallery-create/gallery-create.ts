import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GalleryService } from '../../services/gallery';

@Component({
  selector: 'app-gallery-create',
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './gallery-create.html',
  styleUrl: './gallery-create.css'
})
export class GalleryCreate {
  galleryData = { name: '', date: '' };
  errorMessage = '';

  constructor(private galleryService: GalleryService, private router: Router) {}

  onSubmit() {
    if (!this.galleryData.name || !this.galleryData.date) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.galleryService.createGallery(this.galleryData.name, this.galleryData.date).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.errorMessage = err.error.message || 'Erreur lors de la création'
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}