import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../service/user.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private users: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    return this.users.getMe().pipe(
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
