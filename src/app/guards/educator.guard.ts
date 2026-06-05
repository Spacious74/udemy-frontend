import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const educatorGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('skillUpToken');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    // Decode the payload of the JWT token
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    if (payload && (payload.role === 'teacher' || payload.role === 'admin')) {
      return true;
    } else {
      router.navigate(['/']); // Redirect to home if not authorized
      return false;
    }
  } catch (e) {
    router.navigate(['/login']);
    return false;
  }
};
