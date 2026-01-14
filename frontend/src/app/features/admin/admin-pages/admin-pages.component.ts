import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../../services/pages.service';
import { ImagesService } from '../../../services/images.service';
import { ContentPage, UpsertContentPageRequest } from '../../../models/content-page';

@Component({
    selector: 'app-admin-pages',
    templateUrl: './admin-pages.component.html',
    standalone: false
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
    images: [],
  };
  uploadError: string | null = null;
  uploading = false;

  constructor(private pageService: PagesService, private imagesService: ImagesService) {}

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
    this.current = { slug: page.slug, title: page.title, content: page.content, images: page.images || [] };
    this.info = null;
    this.error = null;
  }

  newPage() {
    this.current = { slug: '', title: '', content: '', images: [] };
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

  addImageUrl(url: string) {
    if (!url) return;
    const trimmed = url.trim();
    if (!trimmed) return;
    const images = this.current.images || [];
    this.current = { ...this.current, images: [...images, trimmed] };
  }

  removeImage(url: string) {
    const images = (this.current.images || []).filter((u) => u !== url);
    this.current = { ...this.current, images };
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploadError = null;
    this.uploading = true;
    this.imagesService.upload(file).subscribe({
      next: (resp) => {
        this.addImageUrl(resp.imageUrl);
        this.uploading = false;
      },
      error: () => {
        this.uploadError = 'Upload failed.';
        this.uploading = false;
      },
    });
  }
}
