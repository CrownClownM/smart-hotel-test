import { Routes } from '@angular/router';
import { LayoutComponent } from '@pages/layout/layout.component';
import { AuthGuard } from '@utils/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'acceso',
    loadChildren: () => import('@routes/auth.routes').then(r => r.AuthRoutes)
  },
  {
    path: 'app',
    component: LayoutComponent,
    loadChildren: () => import('@routes/private.routes').then(r => r.PrivateRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'acceso/inicio-sesion'
  }
];
