import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  of,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class SessionService implements OnDestroy {
  private userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();
  private meRequest$?: Observable<User>;

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
          return this.fetchMeShared().pipe(
            catchError(() => {
              this.userSubject.next(null);
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  refreshUser(): Observable<User> {
    return this.fetchMeShared();
  }

  private fetchMeShared(): Observable<User> {
    if (!this.meRequest$) {
      this.meRequest$ = this.users.getMe().pipe(
        tap((u) => this.userSubject.next(u)),
        finalize(() => {
          this.meRequest$ = undefined;
        }),
        shareReplay(1)
      );
    }
    return this.meRequest$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
