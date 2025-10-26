import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../core/posts.service';

@Component({
  standalone: true,
  selector: 'nb-post-detail',
  imports: [CommonModule],
  template: `
    <article *ngIf="vm">
      <h1>{{ vm.title }}</h1>
      <small
        >{{ vm.category?.name }} • {{ vm.authorUsername }} •
        {{ vm.createdAt | date : 'medium' }}</small
      >
      <img *ngIf="vm.imageUrl" [src]="vm.imageUrl" style="max-width:100%; margin:12px 0" />
      <div class="content" [innerHTML]="vm.content"></div>
    </article>
  `,
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(PostsService);
  vm: any;

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.svc.bySlug(slug).subscribe((p) => (this.vm = p));
  }
}
