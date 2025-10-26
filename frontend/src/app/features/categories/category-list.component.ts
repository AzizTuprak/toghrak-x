import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PostsService } from '../../core/posts.service';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'nb-category-list',
  imports: [CommonModule, RouterLink, MatPaginatorModule],
  template: `
    <h1>Category: {{ slug }}</h1>
    <section class="list">
      <article *ngFor="let p of posts()">
        <a [routerLink]="['/post', p.slug]"
          ><h3>{{ p.title }}</h3></a
        >
        <p>{{ p.excerpt }}</p>
      </article>
    </section>
    <mat-paginator
      [length]="total()"
      [pageIndex]="page()"
      [pageSize]="size()"
      (page)="change($event)"
    ></mat-paginator>
  `,
  styles: [
    `
      .list {
        display: grid;
        gap: 16px;
      }
      article {
        border: 1px solid #ddd;
        padding: 12px;
        border-radius: 8px;
      }
    `,
  ],
})
export class CategoryListComponent {
  private route = inject(ActivatedRoute);
  private postsSvc = inject(PostsService);

  private destroyRef = inject(DestroyRef);
  slug = signal(this.route.snapshot.paramMap.get('slug') ?? '');

  posts = signal<any[]>([]);
  total = signal(0);
  page = signal(0);
  size = signal(environment.pageSizeDefault);

  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const nextSlug = params.get('slug');
      if (!nextSlug) {
        return;
      }

      const slugChanged = nextSlug !== this.slug();
      this.slug.set(nextSlug);

      if (slugChanged) {
        this.page.set(0);
      }

      this.load();
    });
  }

  load() {
    const slug = this.slug();
    if (!slug) {
      return;
    }

    this.postsSvc.list(this.page(), this.size(), slug).subscribe((pg) => {
      this.posts.set(pg.content);
      this.total.set(pg.totalElements);
    });
  }
  change(ev: PageEvent) {
    this.page.set(ev.pageIndex);
    this.size.set(ev.pageSize);
    this.load();
  }
}
