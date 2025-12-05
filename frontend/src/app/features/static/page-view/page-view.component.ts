import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../../../service/page.service';
import { ContentPage } from '../../../models/content-page';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
})
export class PageViewComponent implements OnInit {
  page?: ContentPage;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private pageService: PageService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.fetch(slug);
      }
    });
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
