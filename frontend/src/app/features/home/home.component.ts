import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../../core/posts.service';
import { PostSummary } from '../../core/models';
import { environment } from '../../../../environments/environment';
import { HeroComponent } from './hero/hero';
import { FeaturedListComponent } from './featured-list/featured-list';
import { SectionGridComponent } from './section-grid/section-grid';

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
  posts = signal<PostSummary[]>([]);
  private resolveImage(imageUrl?: string | null) {
    return imageUrl ? `${environment.imageBaseUrl}${imageUrl}` : '/assets/placeholder.jpg';
  }
  ngOnInit() {
    this.postsSvc.list(0, 12).subscribe((pg) => this.posts.set(pg.content));
  }

  get first() {
    return this.posts()[0];
  }
  get firstImage() {
    return this.first ? this.resolveImage(this.first.imageUrl) : null;
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
        image: this.resolveImage(p.imageUrl),
      }))
  );

  section = (categorySlug: string) =>
    this.posts()
      .filter((p) => p.category?.slug === categorySlug)
      .slice(0, 3)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        image: this.resolveImage(p.imageUrl),
        date: p.createdAt,
      }));
}
