import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { CategoriesService } from './services/categories.service';
import { PagesService } from './services/pages.service';
import { SocialLinksService } from './services/social-links.service';
import { SiteSettingsService } from './services/site-settings.service';
import { UiMessage, UiMessageService } from './services/ui-message.service';
import { NavHighlightService } from './services/nav-highlight.service';
import { Category } from './models/category';
import { User } from './models/user';

@Component({
    template: '',
    standalone: false
})
class DummyComponent {}

describe('AppComponent', () => {
  const user: User = { id: 1, username: 'u1', email: 'u1@example.com', roleName: 'ADMIN' };
  const categories: Category[] = [
    { id: 1, name: 'Events', slug: 'events' },
    { id: 2, name: 'News', slug: 'news' },
  ];

  let messageSubject: BehaviorSubject<UiMessage | null>;
  let userSubject: BehaviorSubject<User | null>;
  let loggedInSubject: BehaviorSubject<boolean>;
  let uiService: { message$: any; clear: jasmine.Spy };

  beforeEach(async () => {
    document.body.style.overflow = '';

    messageSubject = new BehaviorSubject<UiMessage | null>(null);
    userSubject = new BehaviorSubject<User | null>(user);
    loggedInSubject = new BehaviorSubject<boolean>(true);

    uiService = {
      message$: messageSubject.asObservable(),
      clear: jasmine.createSpy('clear').and.callFake(() => messageSubject.next(null)),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
      ],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: { logout: () => {} } },
        {
          provide: SessionService,
          useValue: { isLoggedIn$: loggedInSubject.asObservable(), user$: userSubject.asObservable() },
        },
        { provide: CategoriesService, useValue: { categories$: of(categories), refresh: () => {} } },
        { provide: PagesService, useValue: { pages$: of([]), load: () => {} } },
        { provide: SocialLinksService, useValue: { links$: of([]), load: () => {} } },
        { provide: SiteSettingsService, useValue: { settings$: of(null), load: () => {} } },
        { provide: UiMessageService, useValue: uiService },
        { provide: NavHighlightService, useValue: { category$: of(null) } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('toggles menu open/close and locks body scroll', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const toggleBtn = fixture.nativeElement.querySelector('button.menu-toggle') as HTMLButtonElement;
    toggleBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isMenuOpen).toBeTrue();
    expect(document.body.style.overflow).toBe('hidden');
    expect(fixture.nativeElement.querySelector('.menu-backdrop')).toBeTruthy();

    const closeBtn = fixture.nativeElement.querySelector('button.menu-close') as HTMLButtonElement;
    closeBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isMenuOpen).toBeFalse();
    expect(document.body.style.overflow).toBe('');
  });

  it('tracks account menu open/close via details toggle', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const details = fixture.nativeElement.querySelector('details.account-menu') as HTMLDetailsElement;
    expect(details).toBeTruthy();

    details.open = true;
    details.dispatchEvent(new Event('toggle'));
    fixture.detectChanges();
    expect(fixture.componentInstance.isAccountMenuOpen).toBeTrue();

    details.open = false;
    details.dispatchEvent(new Event('toggle'));
    fixture.detectChanges();
    expect(fixture.componentInstance.isAccountMenuOpen).toBeFalse();
  });

  it('closes menus when a nav link is clicked', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    fixture.componentInstance.isMenuOpen = true;
    fixture.componentInstance.isAccountMenuOpen = true;
    document.body.style.overflow = 'hidden';
    fixture.detectChanges();

    const homeLink = fixture.debugElement
      .queryAll(By.css('a.menu-item'))
      .find((de) => (de.nativeElement.textContent ?? '').trim() === 'Home');

    expect(homeLink).toBeTruthy();
    homeLink!.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.isMenuOpen).toBeFalse();
    expect(fixture.componentInstance.isAccountMenuOpen).toBeFalse();
    expect(document.body.style.overflow).toBe('');
  });

  it('dismisses the global banner by clearing the UI message', () => {
    const fixture = TestBed.createComponent(AppComponent);
    messageSubject.next({ kind: 'error', text: 'Boom' });
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.global-banner') as HTMLElement;
    expect(banner).toBeTruthy();

    const closeBtn = fixture.nativeElement.querySelector('.global-banner .close') as HTMLButtonElement;
    closeBtn.click();
    fixture.detectChanges();

    expect(uiService.clear).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('.global-banner')).toBeFalsy();
  });
});
