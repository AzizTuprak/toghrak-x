import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../service/categories.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  info: string | null = null;

  form: { name: string; description: string } = {
    name: '',
    description: '',
  };
  editingId: number | null = null;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.categoriesService.list().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.categoriesService.refresh();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load categories.';
        this.loading = false;
      },
    });
  }

  save() {
    if (this.saving || !this.form.name.trim()) return;
    this.saving = true;
    this.error = null;
    this.info = null;
    const payload = {
      name: this.form.name.trim(),
      description: this.form.description.trim(),
    };

    const isEditing = this.editingId !== null;
    const request$ = isEditing && this.editingId !== null
      ? this.categoriesService.update(this.editingId, payload)
      : this.categoriesService.create(payload);

    request$.subscribe({
      next: () => {
        this.form = { name: '', description: '' };
        this.editingId = null;
        this.fetch();
        this.categoriesService.refresh();
        this.saving = false;
        this.info = isEditing ? 'Category updated.' : 'Category created.';
      },
      error: () => {
        this.error = this.editingId ? 'Failed to update category.' : 'Failed to create category.';
        this.saving = false;
      },
    });
  }

  remove(id: number) {
    if (!confirm('Delete this category?')) return;
    this.error = null;
    this.info = null;
    this.categoriesService.delete(id).subscribe({
      next: () => {
        this.fetch();
        this.categoriesService.refresh();
        this.info = 'Category deleted.';
      },
      error: (err) => {
        // surface backend message (e.g., if posts still exist)
        this.error = err?.error?.message || 'Failed to delete category.';
      },
    });
  }

  startEdit(cat: Category) {
    this.editingId = cat.id;
    this.form = { name: cat.name, description: cat.description || '' };
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { name: '', description: '' };
  }
}
