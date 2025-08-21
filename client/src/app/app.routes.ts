import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'planets',
    loadComponent: () => import('@pages/planets/planets.component').then(module => module.PlanetsComponent),
    children: [
      {
        path: 'table',
        loadComponent: () =>
          import('@pages/planets/planets-table/planets-table.component').then(module => module.PlanetsTableComponent),
      },
      {
        path: 'grid',
        loadComponent: () =>
          import('@pages/planets/planets-grid/planets-grid.component').then(module => module.PlanetsGridComponent),
      },
    ],
  },
  {
    path: 'page-not-found',
    loadComponent: () => import('@pages/not-found/not-found.component').then(module => module.NotFoundComponent),
  },
  { path: '', redirectTo: 'planets', pathMatch: 'full' },
  { path: '**', redirectTo: 'page-not-found' },
];
