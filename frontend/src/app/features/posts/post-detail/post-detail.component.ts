import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../../services/posts.service';
import { PostResponse } from '../../../models/post';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post?: PostResponse;
  loading = false;
  error: string | null = null;
  deleting = false;
  currentUser?: User;
  isAdmin = false;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private posts: PostsService,
    private auth: AuthService,
    private users: UsersService
  ) {}

  ngOnInit(): void {
    // Load current user to decide if edit/delete actions should show
    this.auth
      .isLoggedIn()
      .pipe(switchMap((loggedIn) => (loggedIn ? this.users.getMe() : of(null))))
      .subscribe((user) => {
        this.currentUser = user ?? undefined;
        this.isAdmin = user?.roleName === 'ADMIN';
        this.updateOwnershipFlag();
      });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigateByUrl('/');
      return;
    }
    this.fetch(id);
  }

  fetch(id: number) {
    this.loading = true;
    this.error = null;
    this.posts.get(id).subscribe({
      next: (res) => {
        this.post = res;
        this.loading = false;
        this.updateOwnershipFlag();
      },
      error: () => {
        this.error = 'Post not found.';
        this.loading = false;
      },
    });
  }
  deletePost() {
    if (!this.post || this.deleting) return;
    if (!confirm('Delete this post?')) return;
    this.deleting = true;
    this.posts.delete(this.post.id).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => {
        this.error = 'Failed to delete post.';
        this.deleting = false;
      },
    });
  }

  private updateOwnershipFlag() {
    if (!this.post || !this.currentUser) {
      this.isOwner = false;
      return;
    }
    this.isOwner = this.post.authorUsername === this.currentUser.username;
  }
}
