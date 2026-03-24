import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PhotoService } from '../../services/photo';

@Component({
  selector: 'app-gallery-upload',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule, MatProgressBarModule, NgxDropzoneModule],
  templateUrl: './gallery-upload.html',
  styleUrl: './gallery-upload.css'
})
export class GalleryUpload implements OnInit {
  galleryId: string = '';
  selectedFiles: File[] = [];
  previews: string[] = [];
  isUploading: boolean = false;
  uploadSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService
  ) {}

  ngOnInit() {
    this.galleryId = this.route.snapshot.paramMap.get('id') || '';
  }

  onFilesSelected(event: any) {
    const newFiles: File[] = event.addedFiles;
    this.selectedFiles = [...this.selectedFiles, ...newFiles];

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
  }

  uploadPhotos() {
    if (this.selectedFiles.length === 0) return;

    this.isUploading = true;
    this.photoService.uploadPhotos(this.galleryId, this.selectedFiles).subscribe({
      next: () => {
        this.isUploading = false;
        this.uploadSuccess = true;
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        console.error('Erreur upload', err);
        this.isUploading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}