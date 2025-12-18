import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { PostsService } from '../../../services/posts.service';
import { ImagesService } from '../../../services/images.service';
import { Category } from '../../../models/category';
import {
  CreatePostRequest,
  UpdatePostRequest,
  PostResponse,
} from '../../../models/post';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
})
export class PostFormComponent implements OnInit {
  isEdit = false;
  postId?: number;
  categories: Category[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  uploadError: string | null = null;
  imageUrls: string[] = [];
  uploadingGallery = false;

  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
    coverImage: [''],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private postsService: PostsService,
    private imagesService: ImagesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.postId = Number(id);
      this.loadPost(this.postId);
    }
  }

  loadCategories() {
    this.categoriesService.list().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.error = 'Failed to load categories.'),
    });
  }

  loadPost(id: number) {
    this.loading = true;
    this.postsService.get(id).subscribe({
      next: (p: PostResponse) => {
        this.form.patchValue({
          title: p.title,
          content: p.content,
          categoryId: p.categoryId ?? null,
          coverImage: p.coverImage || '',
        });
        this.imageUrls = [...(p.imageUrls || [])];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load post.';
        this.loading = false;
      },
    });
  }

  submit() {
    if (this.saving) return;
    this.error = null;
    if (this.form.invalid) {
      this.error = 'Please fill in title, content, and choose a category.';
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const payload = {
      ...(this.form.value as any),
      imageUrls: this.imageUrls,
    } as CreatePostRequest | UpdatePostRequest;
    const request$ =
      this.isEdit && this.postId
        ? this.postsService.update(this.postId, payload as UpdatePostRequest)
        : this.postsService.create(payload as CreatePostRequest);

    request$.subscribe({
      next: (res) => this.router.navigate(['/posts', res.id]),
      error: () => {
        this.error = 'Failed to save post.';
        this.saving = false;
      },
    });
  }

  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploadError = null;
    this.imagesService.upload(file).subscribe({
      next: (resp) => this.form.patchValue({ coverImage: resp.imageUrl }),
      error: () => (this.uploadError = 'Upload failed.'),
    });
  }

  onGallerySelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files);
    this.uploadingGallery = true;
    let remaining = files.length;
    files.forEach((file) => {
      this.imagesService.upload(file).subscribe({
        next: (resp) => this.imageUrls.push(resp.imageUrl),
        error: () => (this.uploadError = 'One or more gallery uploads failed.'),
        complete: () => {
          remaining -= 1;
          if (remaining === 0) {
            this.uploadingGallery = false;
          }
        },
      });
    });
  }

  removeGalleryImage(url: string) {
    this.imageUrls = this.imageUrls.filter((u) => u !== url);
  }
}
