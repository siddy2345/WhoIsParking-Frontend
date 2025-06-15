import { Routes } from '@angular/router';
import { canActivate } from './services/auth/auth.guard';
import { PARKED_CAR_ROUTE } from './app.models';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./user/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'house',
    canActivate: [canActivate],
    loadComponent: () =>
      import('./house/house.component').then((m) => m.HouseComponent),
    children: [
      {
        path: '',
        redirectTo: 'detail',
        pathMatch: 'full',
      },
      {
        path: 'editor',
        loadComponent: () =>
          import('./house/house-editor/house-editor.component').then(
            (m) => m.HouseEditorComponent
          ),
      },
      {
        path: 'editor/:houseId',
        loadComponent: () =>
          import('./house/house-editor/house-editor.component').then(
            (m) => m.HouseEditorComponent
          ),
      },
      {
        path: 'detail',
        loadComponent: () =>
          import('./house/house-detail/house-detail.component').then(
            (m) => m.HouseDetailComponent
          ),
      },
    ],
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
    path: `${PARKED_CAR_ROUTE}/:houseId`,
    loadComponent: () =>
      import('./parked-car/parked-car.component').then(
        (m) => m.ParkedCarComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import(
        './page-not-found-component/page-not-found-component.component'
      ).then((m) => m.PageNotFoundComponentComponent),
  },
];
