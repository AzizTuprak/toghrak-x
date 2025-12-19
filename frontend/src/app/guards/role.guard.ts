import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    return this.session.user$.pipe(
      take(1),
      switchMap((user) => (user ? of(user) : this.session.refreshUser())),
      map((user) => {
        const role = user.roleName;
        if (role && requiredRoles.includes(role)) {
          return true;
        }
        return this.router.createUrlTree(['/']);
      }),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );
  }
}
