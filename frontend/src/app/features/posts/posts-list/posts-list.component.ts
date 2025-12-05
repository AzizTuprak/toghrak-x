import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { PostsService } from '../../../service/posts.service';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user.service';
import { PostResponse } from '../../../models/post';
import { Page } from '../../../models/page';
import { User } from '../../../models/user';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  page?: Page<PostResponse>;
  loading = false;
  error: string | null = null;
  isLoggedIn$: Observable<boolean>;
  currentUser?: User;
  isAdmin = false;
  currentCategoryId?: number;

  constructor(
    private postsService: PostsService,
    private auth: AuthService,
    private users: UserService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
  }

  get posts(): PostResponse[] {
    return this.page?.content ?? [];
  }

  ngOnInit(): void {
    this.isLoggedIn$
      .pipe(
        switchMap((loggedIn) => (loggedIn ? this.users.getMe() : of(null)))
      )
      .subscribe((user) => {
        this.currentUser = user ?? undefined;
        this.isAdmin = user?.roleName === 'ADMIN';
      });

    // react to category filter in query params
    this.route.queryParamMap.subscribe((params) => {
      const categoryIdParam = params.get('category');
      const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
      this.currentCategoryId = categoryId;
      this.load(0, categoryId);
    });
  }

  canEdit(post: PostResponse): boolean {
    if (this.isAdmin) return true;
    return !!this.currentUser && post.authorUsername === this.currentUser.username;
  }

  load(page: number, categoryId: number | undefined = this.currentCategoryId) {
    this.currentCategoryId = categoryId;
    this.loading = true;
    this.error = null;
    this.postsService.list(page, 10, categoryId).subscribe({
      next: (res: Page<PostResponse>) => {
        this.page = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load posts.';
        this.loading = false;
      },
    });
  }

  clearCategory() {
    this.router.navigate([], { relativeTo: this.route, queryParams: { category: null }, queryParamsHandling: 'merge' });
  }
}
