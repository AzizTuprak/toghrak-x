import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../core/posts.service';
import { environment } from '../../../environments/environment';
import { HeroComponent } from './hero/hero.component';
import { FeaturedListComponent } from './featured-list/featured-list.component';
import { SectionGridComponent } from './section-grid/section-grid.component';

@Component({
  standalone: true,
  selector: 'nb-home',
  imports: [CommonModule, RouterLink, HeroComponent, FeaturedListComponent, SectionGridComponent],
  template: `
    <div class="layout">
      <div class="left">
        <nb-hero [image]="firstImage" [title]="firstTitle" [link]="['/post', firstSlug]"> </nb-hero>
      </div>
      <div class="right">
        <nb-featured-list [items]="featured()"></nb-featured-list>
      </div>
    </div>

    <nb-section-grid title="EVENTS" category="Events" [posts]="section('events')"></nb-section-grid>
    <nb-section-grid
      title="PROBLEMS"
      category="Problems"
      [posts]="section('problems')"
    ></nb-section-grid>
    <nb-section-grid
      title="CULTURE"
      category="Culture"
      [posts]="section('culture')"
    ></nb-section-grid>
  `,
  styles: [
    `
      .layout {
        display: grid;
        grid-template-columns: 1.6fr 0.9fr;
        gap: 22px;
        margin: 18px 0 26px;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent {
  private postsSvc = inject(PostsService);
  posts = signal<any[]>([]);
  ngOnInit() {
    this.postsSvc.list(0, 12).subscribe((pg) => this.posts.set(pg.content));
  }

  get first() {
    return this.posts()[0];
  }
  get firstImage() {
    return this.first
      ? this.first?.imageUrls?.[0]
        ? `${environment.imageBaseUrl}${this.first.imageUrls[0]}`
        : '/assets/placeholder.jpg'
      : null;
  }
  get firstTitle() {
    return this.first?.title ?? '';
  }
  get firstSlug() {
    return this.first?.slug ?? '';
  }

  featured = computed(() =>
    this.posts()
      .slice(1, 4)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        image: p.imageUrls?.[0]
          ? `${environment.imageBaseUrl}${p.imageUrls[0]}`
          : '/assets/placeholder.jpg',
      }))
  );

  section = (categorySlug: string) =>
    this.posts()
      .filter((p) => p.categorySlug === categorySlug) // adjust to your field name
      .slice(0, 3)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        image: p.imageUrls?.[0]
          ? `${environment.imageBaseUrl}${p.imageUrls[0]}`
          : '/assets/placeholder.jpg',
        date: p.createdAt,
      }));
}
