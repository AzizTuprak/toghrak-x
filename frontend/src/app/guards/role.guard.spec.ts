import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RoleGuard } from './role.guard';
import { SessionService } from '../services/session.service';
import { User } from '../models/user';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let router: Router;
  let session: { user$: any; refreshUser: jasmine.Spy };

  beforeEach(() => {
    session = {
      user$: of(null),
      refreshUser: jasmine.createSpy('refreshUser'),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [RoleGuard, { provide: SessionService, useValue: session }],
    });

    guard = TestBed.inject(RoleGuard);
    router = TestBed.inject(Router);
  });

  it('allows access when no roles are required', (done) => {
    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    guard.canActivate(route).subscribe((res) => {
      expect(res).toBe(true);
      done();
    });
  });

  it('allows access when user has required role', (done) => {
    const user: User = { id: 1, username: 'a', email: 'a@a.com', roleName: 'ADMIN' };
    session.user$ = of(user);
    const route = { data: { roles: ['ADMIN'] } } as unknown as ActivatedRouteSnapshot;

    guard.canActivate(route).subscribe((res) => {
      expect(res).toBe(true);
      done();
    });
  });

  it('denies access when user lacks required role', (done) => {
    const user: User = { id: 1, username: 'a', email: 'a@a.com', roleName: 'EDITOR' };
    session.user$ = of(user);
    const route = { data: { roles: ['ADMIN'] } } as unknown as ActivatedRouteSnapshot;

    guard.canActivate(route).subscribe((res) => {
      const url = router.serializeUrl(res as UrlTree);
      expect(url).toBe('/');
      done();
    });
  });

  it('refreshes user when missing and then evaluates roles', (done) => {
    const user: User = { id: 1, username: 'a', email: 'a@a.com', roleName: 'ADMIN' };
    session.user$ = of(null);
    session.refreshUser.and.returnValue(of(user));
    const route = { data: { roles: ['ADMIN'] } } as unknown as ActivatedRouteSnapshot;

    guard.canActivate(route).subscribe((res) => {
      expect(session.refreshUser).toHaveBeenCalledTimes(1);
      expect(res).toBe(true);
      done();
    });
  });

  it('redirects to login on refresh error', (done) => {
    session.user$ = of(null);
    session.refreshUser.and.returnValue(throwError(() => new Error('boom')));
    const route = { data: { roles: ['ADMIN'] } } as unknown as ActivatedRouteSnapshot;

    guard.canActivate(route).subscribe((res) => {
      const url = router.serializeUrl(res as UrlTree);
      expect(url).toBe('/login');
      done();
    });
  });
});

