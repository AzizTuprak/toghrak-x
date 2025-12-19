import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlreadyAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = this.auth.getToken();
    if (token) {
      this.router.navigateByUrl('/');
      return of(false);
    }

    return this.auth.ensureToken().pipe(
      map((t) => {
        if (!t) return true;
        this.router.navigateByUrl('/');
        return false;
      }),
      catchError(() => of(true))
    );
  }
}
