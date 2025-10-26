import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const roleGuard = (roles: string[]): CanMatchFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const ok = auth.isAuthenticated && roles.includes(auth.role ?? '');
    if (!ok) router.navigate(['/']);
    return ok;
  };
};
