import { Component, OnInit } from '@angular/core';
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
})
export class PostsListComponent implements OnInit {
  page?: Page<PostResponse>;
  loading = false;
  error: string | null = null;
  isLoggedIn$: Observable<boolean>;
  currentUser?: User;
  isAdmin = false;

  constructor(
    private posts: PostsService,
    private auth: AuthService,
    private users: UserService
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
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
    this.load(0);
  }

  canEdit(post: PostResponse): boolean {
    if (this.isAdmin) return true;
    return !!this.currentUser && post.authorUsername === this.currentUser.username;
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
