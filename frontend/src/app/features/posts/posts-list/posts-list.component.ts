import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from '../../../service/posts.service';
import { AuthService } from '../../../service/auth.service';
import { PostResponse } from '../../../models/post';
import { Page } from '../../../models/page';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent implements OnInit {
  page?: Page<PostResponse>;
  loading = false;
  error: string | null = null;
  isLoggedIn$: Observable<boolean>;

  constructor(private posts: PostsService, private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
  }

  ngOnInit(): void {
    this.load(0);
  }

  load(page: number) {
    this.loading = true;
    this.error = null;
    this.posts.list(page, 10).subscribe({
      next: (res) => {
        this.page = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load posts.';
        this.loading = false;
      },
    });
  }
}
