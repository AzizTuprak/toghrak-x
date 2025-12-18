import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { SearchResult } from '../../../models/search-result';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  query = '';
  results: SearchResult[] = [];
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.query = params.get('q') ?? '';
      if (this.query) {
        this.runSearch();
      } else {
        this.results = [];
      }
    });
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
