import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FooterLink {
  label: string;
  route: string;
}

// Persisted locally for footer nav links
@Injectable({ providedIn: 'root' })
export class FooterService {
  private readonly storageKey = 'tn_footer_links';
  private defaultLinks: FooterLink[] = [
    { label: 'About', route: '/page/about' },
    { label: 'Contact', route: '/page/contact' },
    { label: 'How it works', route: '/page/how-it-works' },
    { label: 'FAQ', route: '/page/faq' },
    { label: 'Privacy Policy', route: '/page/privacy' },
    { label: 'Terms of use', route: '/page/terms' },
  ];

  private linksSubject = new BehaviorSubject<FooterLink[]>(this.load());
  links$ = this.linksSubject.asObservable();

  update(links: FooterLink[]) {
    this.linksSubject.next(links);
    localStorage.setItem(this.storageKey, JSON.stringify(links));
  }

  reset() {
    this.update(this.defaultLinks);
  }

  private load(): FooterLink[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore parse errors
    }
    return this.defaultLinks;
  }
}
