import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { lockGuard } from './lock-screen/lock.guard';

export const routes: Routes = [
  { path: '', component: Home, canActivate: [lockGuard] },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About), canActivate: [lockGuard] },
  { path: '**', redirectTo: '' }
];
