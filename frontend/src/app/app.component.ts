import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of, switchMap, takeUntil } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { CategoriesService } from './services/categories.service';
import { PagesService } from './services/pages.service';
import { SocialLinksService } from './services/social-links.service';
import { SocialLink } from './models/social-link';
import { User } from './models/user';
import { Category } from './models/category';
import { ContentPage } from './models/content-page';
import { SiteSettingsService } from './services/site-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  currentUser?: User;
  isAdmin = false;
  categories: Category[] = [];
  footerSearch = '';
  footerPages: ContentPage[] = [];
  socialLinks: SocialLink[] = [];
  brandLogo = 'assets/tn.png';
  brandTitle = 'TuprakNews';
  brandTagline = 'Stories that matter, in one place.';
  isMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private users: UsersService,
    private categoriesService: CategoriesService,
    private pageService: PagesService,
    private socialLinksService: SocialLinksService,
    private siteSettingsService: SiteSettingsService,
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
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.isAdmin = user.roleName === 'ADMIN';
        }
      });

    this.categoriesService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cats) => (this.categories = cats));
    this.categoriesService.refresh();

    this.pageService.pages$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pages) => (this.footerPages = pages));
    this.pageService.load();
    this.socialLinksService.links$
      .pipe(takeUntil(this.destroy$))
      .subscribe((links) => (this.socialLinks = links));
    this.socialLinksService.load();
    this.siteSettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        if (settings?.title) {
          this.brandTitle = settings.title;
        } else {
          this.brandTitle = 'TuprakNews';
        }
        if (settings?.logoUrl) {
          this.brandLogo = settings.logoUrl;
        } else {
          this.brandLogo = 'assets/tn.png';
        }
        if (settings?.slogan) {
          this.brandTagline = settings.slogan;
        } else {
          this.brandTagline = 'Stories that matter, in one place.';
        }
      });
    this.siteSettingsService.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.auth.logout();
    this.currentUser = undefined;
    this.isAdmin = false;
    this.router.navigateByUrl('/'); // go to home
    this.isMenuOpen = false;
  }

  goToCategory(cat?: Category) {
    if (!cat) {
      this.router.navigate(['/'], { queryParams: { page: 0 } });
    } else {
      this.router.navigate(['/', cat.slug], { queryParams: { page: 0 } });
    }
    this.isMenuOpen = false;
  }

  goToSearch() {
    this.router.navigate(['/search'], { queryParams: { q: this.footerSearch || null } });
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
