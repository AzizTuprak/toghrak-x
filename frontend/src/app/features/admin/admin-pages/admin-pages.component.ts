import { Component, OnInit } from '@angular/core';
import { PageService } from '../../../service/page.service';
import { ContentPage, UpsertContentPageRequest } from '../../../models/content-page';

const DEFAULT_SLUGS = [
  { slug: 'about', title: 'About' },
  { slug: 'contact', title: 'Contact' },
  { slug: 'how-it-works', title: 'How It Works' },
  { slug: 'faq', title: 'FAQ' },
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'terms', title: 'Terms of Use' },
];

@Component({
  selector: 'app-admin-pages',
  templateUrl: './admin-pages.component.html',
})
export class AdminPagesComponent implements OnInit {
  pages: ContentPage[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  current: UpsertContentPageRequest = {
    slug: 'about',
    title: 'About',
    content: '',
  };

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.pageService.list().subscribe({
      next: (pages) => {
        this.pages = pages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load pages.';
        this.loading = false;
      },
    });
  }

  loadSlug(slug: string) {
    const existing = this.pages.find((p) => p.slug === slug);
    if (existing) {
      this.current = { slug: existing.slug, title: existing.title, content: existing.content };
    } else {
      const preset = DEFAULT_SLUGS.find((d) => d.slug === slug);
      this.current = { slug, title: preset?.title || slug, content: '' };
    }
  }

  save() {
    if (this.saving) return;
    this.saving = true;
    this.error = null;
    const exists = this.pages.find((p) => p.slug === this.current.slug);
    const req$ = exists
      ? this.pageService.update(exists.slug, this.current)
      : this.pageService.create(this.current);
    req$.subscribe({
      next: () => {
        this.saving = false;
        this.fetch();
      },
      error: () => {
        this.error = 'Failed to save page.';
        this.saving = false;
      },
    });
  }

  remove(slug: string) {
    if (!confirm('Delete this page?')) return;
    this.pageService.delete(slug).subscribe({
      next: () => this.fetch(),
      error: () => (this.error = 'Failed to delete page.'),
    });
  }

  presetSlugs() {
    return DEFAULT_SLUGS;
  }
}
