import { Route } from "@angular/router";

export const RoomsRoutes: Route[] = [
  {
    path: 'lista-habitaciones',
    loadComponent: () => import('@pages/rooms/list/list.component').then(c => c.ListComponent)
  },
  {
    path: 'lista/:idHotel',
    loadComponent: () => import('@pages/rooms/list/list.component').then(c => c.ListComponent)
  },
  {
    path: 'crear/:idHotel',
    loadComponent: () => import('@pages/rooms/create/create.component').then(c => c.CreateComponent)
  },
  {
    path: 'editar/:idHotel/:idRoom',
    loadComponent: () => import('@pages/rooms/create/create.component').then(c => c.CreateComponent)
  },
]
