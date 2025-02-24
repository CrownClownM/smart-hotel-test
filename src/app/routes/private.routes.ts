import { Route } from "@angular/router";

export const PrivateRoutes: Route[] = [
  {
    path: 'inicio',
    loadComponent: () => import('@pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'hoteles',
    loadChildren: () => import('@routes/hotels.routes').then(r => r.HotelsRoutes),
  },
  {
    path: 'habitaciones',
    loadChildren: () => import('@routes/rooms.routes').then(r => r.RoomsRoutes),
  },
  {
    path: 'reservaciones',
    loadChildren: () => import('@routes/reservations.routes').then(r => r.ReservationsRoutes),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  }
]
