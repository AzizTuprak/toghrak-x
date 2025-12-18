import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PagesService } from '../../../services/pages.service';
import { ContentPage } from '../../../models/content-page';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.css'],
})
export class PageViewComponent implements OnInit, OnDestroy {
  page?: ContentPage;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private pageService: PagesService) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const slug = params.get('slug');
        if (slug) {
          this.fetch(slug);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetch(slug: string) {
    this.loading = true;
    this.error = null;
    this.pageService.get(slug).subscribe({
      next: (p) => {
        this.page = p;
        this.loading = false;
      },
      error: () => {
        this.error = 'Page not found.';
        this.loading = false;
      },
    });
  }
}
