import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { CategoriesService } from './service/categories.service';
import { FooterService, FooterLink } from './service/footer.service';
import { SocialLinksService } from './service/social-links.service';
import { SocialLink } from './models/social-link';
import { User } from './models/user';
import { Category } from './models/category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  currentUser?: User;
  isAdmin = false;
  categories: Category[] = [];
  footerSearch = '';
  footerLinks: FooterLink[] = [];
  socialLinks: SocialLink[] = [];

  constructor(
    private auth: AuthService,
    private users: UserService,
    private categoriesService: CategoriesService,
    private footerService: FooterService,
    private socialLinksService: SocialLinksService,
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

    this.categoriesService.categories$.subscribe((cats) => (this.categories = cats));
    this.categoriesService.refresh();

    this.footerService.links$.subscribe((links) => (this.footerLinks = links));
    this.socialLinksService.links$.subscribe((links) => (this.socialLinks = links));
    this.socialLinksService.load();
  }

  logout() {
    this.auth.logout();
    this.currentUser = undefined;
    this.isAdmin = false;
    this.router.navigateByUrl('/'); // go to home
  }

  goToCategory(id?: number) {
    if (id === undefined || id === null) {
      this.router.navigate(['/'], { queryParams: { category: null } });
    } else {
      this.router.navigate(['/'], { queryParams: { category: id } });
    }
  }

  goToSearch() {
    this.router.navigate(['/search'], { queryParams: { q: this.footerSearch || null } });
  }
}
