import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('skillUpToken');

  if (token) {
    return true;
  } else {
    // Optionally save the attempted URL for redirecting after login
    router.navigate(['/login']);
    return false;
  }
};
