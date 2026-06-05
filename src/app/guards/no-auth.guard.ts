import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('skillUpToken');

  if (token) {
    // User is already logged in, redirect them away from login/signup (e.g. to home)
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};
