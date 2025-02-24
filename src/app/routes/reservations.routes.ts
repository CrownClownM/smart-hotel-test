import { Route } from "@angular/router";

export const ReservationsRoutes: Route[] = [
  {
    path: 'lista',
    loadComponent: () => import('@pages/reservations/list/list.component').then(c => c.ListComponent)
  },
  {
    path: 'crear/:id',
    loadComponent: () => import('@pages/reservations/create/create.component').then(c => c.CreateComponent)
  },
]
