import { Routes } from '@angular/router';
import { canActivate } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./user/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [canActivate],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'house',
    canActivate: [canActivate],
    loadComponent: () =>
      import('./house/house.component').then((m) => m.HouseComponent),
  },
];
