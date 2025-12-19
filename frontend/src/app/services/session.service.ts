import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, distinctUntilChanged, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class SessionService implements OnDestroy {
  private userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();

  readonly isLoggedIn$: Observable<boolean> = this.auth
    .isLoggedIn()
    .pipe(distinctUntilChanged());

  readonly isAdmin$: Observable<boolean> = this.user$.pipe(
    map((u) => u?.roleName === 'ADMIN'),
    distinctUntilChanged()
  );

  private destroy$ = new Subject<void>();

  constructor(private auth: AuthService, private users: UsersService) {
    this.isLoggedIn$
      .pipe(
        switchMap((loggedIn) => {
          if (!loggedIn) {
            this.userSubject.next(null);
            return of(null);
          }
          return this.users.getMe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (u) => this.userSubject.next(u),
        error: () => this.userSubject.next(null),
      });
  }

  refreshUser(): Observable<User> {
    return this.users.getMe().pipe(tap((u) => this.userSubject.next(u)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

