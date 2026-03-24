import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { GalleryCreate } from './components/gallery-create/gallery-create';
import { GalleryUpload } from './components/gallery-upload/gallery-upload';
import { GalleryView } from './components/gallery-view/gallery-view';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'gallery/create', component: GalleryCreate, canActivate: [authGuard] },
  { path: 'gallery/:id/upload', component: GalleryUpload, canActivate: [authGuard] },
  { path: 'g/:uniqueUrl', component: GalleryView },
  { path: '**', redirectTo: '/login' }
];