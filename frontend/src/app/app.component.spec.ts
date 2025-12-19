import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { CategoriesService } from './services/categories.service';
import { PagesService } from './services/pages.service';
import { SocialLinksService } from './services/social-links.service';
import { SiteSettingsService } from './services/site-settings.service';
import { UiMessageService } from './services/ui-message.service';
import { NavHighlightService } from './services/nav-highlight.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: { logout: () => {} } },
        { provide: SessionService, useValue: { isLoggedIn$: of(false), user$: of(null) } },
        { provide: CategoriesService, useValue: { categories$: of([]), refresh: () => {} } },
        { provide: PagesService, useValue: { pages$: of([]), load: () => {} } },
        { provide: SocialLinksService, useValue: { links$: of([]), load: () => {} } },
        { provide: SiteSettingsService, useValue: { settings$: of(null), load: () => {} } },
        { provide: UiMessageService, useValue: { message$: of(null), clear: () => {} } },
        { provide: NavHighlightService, useValue: { category$: of(null) } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TuprakNews'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
