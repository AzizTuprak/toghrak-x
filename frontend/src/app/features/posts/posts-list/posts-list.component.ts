import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap, combineLatest } from 'rxjs';
import { PostsService } from '../../../services/posts.service';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { PostResponse } from '../../../models/post';
import { Page } from '../../../models/page';
import { User } from '../../../models/user';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  page?: Page<PostResponse>;
  loading = false;
  error: string | null = null;
  popular: PostResponse[] = [];
  popularLoading = false;
  currentPage = 0;
  isLoggedIn$: Observable<boolean>;
  currentUser?: User;
  isAdmin = false;
  currentCategoryId?: number;
  currentCategorySlug?: string | null;

  constructor(
    private postsService: PostsService,
    private auth: AuthService,
    private users: UsersService,
    private categoriesService: CategoriesService,
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

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, q]) => {
        const slug = params.get('slug');
        const pageParam = q.get('page');
        const pageNum = pageParam ? Number(pageParam) : 0;

        if (slug) {
          this.currentCategorySlug = slug;
          this.resolveCategoryBySlug(slug, pageNum);
        } else {
          const categoryIdParam = q.get('category');
          const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
          this.currentCategorySlug = null;
          this.currentCategoryId = categoryId;
          this.currentPage = pageNum;
          this.load(this.currentPage, categoryId);
        }
      }
    );

    this.loadPopular();
  }

  canEdit(post: PostResponse): boolean {
    if (this.isAdmin) return true;
    return !!this.currentUser && post.authorUsername === this.currentUser.username;
  }

  load(page: number, categoryId: number | undefined = this.currentCategoryId) {
    this.currentCategoryId = categoryId;
    this.currentPage = page;
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
    this.router.navigate(['/'], { queryParams: { page: 0 } });
  }

  goToPage(page: number) {
    if (this.currentCategorySlug) {
      this.router.navigate(['/', this.currentCategorySlug], {
        queryParams: { page },
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page, category: this.currentCategoryId ?? null },
        queryParamsHandling: 'merge',
      });
    }
  }

  private loadPopular() {
    this.popularLoading = true;
    this.postsService.popular(6).subscribe({
      next: (res) => {
        this.popular = res;
        this.popularLoading = false;
      },
      error: () => {
        this.popular = [];
        this.popularLoading = false;
      },
    });
  }

  private resolveCategoryBySlug(slug: string, pageNum: number) {
    this.categoriesService.getBySlug(slug).subscribe({
      next: (cat: Category) => {
        this.currentCategoryId = cat.id;
        this.currentPage = pageNum;
        this.load(pageNum, cat.id);
      },
      error: () => {
        this.error = null;
        this.page = undefined;
        // Unknown slug: fall back to home with no filter
        this.router.navigate(['/'], { queryParams: { page: 0 } });
      },
    });
  }
}
