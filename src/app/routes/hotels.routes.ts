import { Route } from "@angular/router";

export const HotelsRoutes: Route[] = [
  {
    path: 'lista',
    loadComponent: () => import('@pages/hotels/list/list.component').then(c => c.ListComponent)
  },
  {
    path: 'crear',
    loadComponent: () => import('@pages/hotels/create/create.component').then(c => c.CreateComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('@pages/hotels/create/create.component').then(c => c.CreateComponent)
  },
]
