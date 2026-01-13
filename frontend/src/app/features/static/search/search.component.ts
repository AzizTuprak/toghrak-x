import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SearchService } from '../../../services/search.service';
import { SearchResult } from '../../../models/search-result';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: false
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  results: SearchResult[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.query = params.get('q') ?? '';
        if (this.query) {
          this.runSearch();
        } else {
          this.results = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  runSearch() {
    if (!this.query.trim()) {
      this.results = [];
      return;
    }
    this.loading = true;
    this.error = null;
    this.searchService.search(this.query).subscribe({
      next: (res) => {
        this.results = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Search failed.';
        this.loading = false;
      },
    });
  }
}
