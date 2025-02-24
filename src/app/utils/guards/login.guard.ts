import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@API/auth/auth.service';

export const loginGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.isLoggedIn;

  if (user) {
    router.navigateByUrl('/app')
    return false
  } else {
    return true
  }
};
