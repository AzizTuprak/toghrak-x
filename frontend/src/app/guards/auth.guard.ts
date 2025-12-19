import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.auth.ensureToken().pipe(
      map((token) => {
        if (token) return true;
        return this.router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }),
      catchError(() =>
        of(
          this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          })
        )
      )
    );
  }
}
