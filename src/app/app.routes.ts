import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./canvas/canvas') },
  { path: 'gallery', loadComponent: () => import('./gallery/gallery') },

  // === Screen routes — add new screens here ===
  { path: 'screen/example', loadComponent: () => import('./screens/example/example') },
];
