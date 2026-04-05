import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'listings',
    loadComponent: () =>
      import('./features/listings/listing-list.component').then((m) => m.ListingListComponent),
  },
  {
    path: 'listings/new',
    loadComponent: () =>
      import('./features/listings/listing-create.component').then((m) => m.ListingCreateComponent),
  },
  {
    path: 'listings/:id',
    loadComponent: () =>
      import('./features/listings/listing-detail.component').then((m) => m.ListingDetailComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: '' },
];
