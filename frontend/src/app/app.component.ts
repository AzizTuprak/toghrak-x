import { Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { User } from './models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  currentUser?: User;
  isAdmin = false;

  constructor(
    private auth: AuthService,
    private users: UserService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
  }

  ngOnInit(): void {
    this.isLoggedIn$
      .pipe(
        switchMap((loggedIn) => {
          if (!loggedIn) {
            this.currentUser = undefined;
            this.isAdmin = false;
            return of(null);
          }
          return this.users.getMe();
        })
      )
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.isAdmin = user.roleName === 'ADMIN';
        }
      });
  }

  logout() {
    this.auth.logout();
    this.currentUser = undefined;
    this.isAdmin = false;
    this.router.navigateByUrl('/'); // go to home
  }
}
