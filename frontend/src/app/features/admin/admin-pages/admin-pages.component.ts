import { Component, OnInit } from '@angular/core';
import { PageService } from '../../../service/page.service';
import { ContentPage, UpsertContentPageRequest } from '../../../models/content-page';

@Component({
  selector: 'app-admin-pages',
  templateUrl: './admin-pages.component.html',
})
export class AdminPagesComponent implements OnInit {
  pages: ContentPage[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  info: string | null = null;

  current: UpsertContentPageRequest = {
    slug: '',
    title: '',
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
        if (!this.current.slug && this.pages.length) {
          this.edit(this.pages[0]);
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load pages.';
        this.loading = false;
      },
    });
  }

  edit(page: ContentPage) {
    this.current = { slug: page.slug, title: page.title, content: page.content };
    this.info = null;
    this.error = null;
  }

  newPage() {
    this.current = { slug: '', title: '', content: '' };
    this.info = 'Drafting a new page. Set slug/title/content, then click Save.';
    this.error = null;
  }

  onSlugBlur() {
    if (this.current.slug) {
      this.current.slug = this.normalizeSlug(this.current.slug);
    }
  }

  private normalizeSlug(slug: string) {
    return slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : '';
  }

  save() {
    if (this.saving) return;
    const normalized = this.normalizeSlug(this.current.slug);
    if (!normalized || !this.current.title.trim()) {
      this.error = 'Slug and title are required.';
      return;
    }
    this.current.slug = normalized;
    this.info = null;
    this.saving = true;
    this.error = null;
    const exists = this.pages.find((p) => p.slug === normalized);
    const req$ = exists
      ? this.pageService.update(exists.slug, this.current)
      : this.pageService.create(this.current);
    req$.subscribe({
      next: () => {
        this.saving = false;
        this.fetch();
        this.info = exists ? 'Page updated.' : 'Page created.';
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
      next: () => {
        this.info = 'Page deleted.';
        this.fetch();
      },
      error: () => (this.error = 'Failed to delete page.'),
    });
  }
}
