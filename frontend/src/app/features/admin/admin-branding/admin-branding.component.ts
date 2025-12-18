import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SiteSettingsService } from '../../../services/site-settings.service';
import { ImagesService } from '../../../services/images.service';
import { SiteSettings } from '../../../models/site-settings';

@Component({
  selector: 'app-admin-branding',
  templateUrl: './admin-branding.component.html',
  styleUrls: ['./admin-branding.component.css'],
})
export class AdminBrandingComponent implements OnInit {
  form: Partial<SiteSettings> = { title: 'TuprakNews', logoUrl: '', slogan: '' };
  loading = false;
  saving = false;
  success?: string;
  error?: string;

  constructor(private settings: SiteSettingsService, private images: ImagesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.settings.settings$.subscribe((s) => {
      if (s) {
        this.form.title = s.title || 'TuprakNews';
        this.form.logoUrl = s.logoUrl || '';
        this.form.slogan = s.slogan || '';
      }
      this.loading = false;
    });
    this.settings.load();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.saving = true;
    this.error = undefined;
    this.images.upload(file).subscribe({
      next: (res) => {
        this.form.logoUrl = res.imageUrl;
        this.success = 'Logo uploaded. Remember to save changes.';
        this.saving = false;
      },
      error: () => {
        this.error = 'Upload failed. Please try again.';
        this.saving = false;
      },
    });
  }

  save(formRef: NgForm) {
    if (formRef.invalid) return;
    this.saving = true;
    this.error = undefined;
    this.success = undefined;
    this.settings.update(this.form).subscribe({
      next: () => {
        this.success = 'Branding updated.';
        this.saving = false;
      },
      error: () => {
        this.error = 'Could not save. Please try again.';
        this.saving = false;
      },
    });
  }
}
