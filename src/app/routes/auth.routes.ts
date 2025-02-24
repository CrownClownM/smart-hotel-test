import { Routes } from '@angular/router';
import { LayoutComponent } from '@pages/auth/layout/layout.component';
import { loginGuard } from '@utils/guards/login.guard';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'inicio-sesion',
        loadComponent: () => import('@pages/auth/login/login.component').then(c => c.LoginComponent),
        canMatch: [loginGuard]
      },
      {
        path: 'registro',
        loadComponent: () => import('@pages/auth/login/login.component').then(c => c.LoginComponent),
        canMatch: [loginGuard]
      },
      {
        path: '**',
        redirectTo: 'inicio-sesion'
      },
    ]
  }
]
