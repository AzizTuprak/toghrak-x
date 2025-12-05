import { Component, OnInit } from '@angular/core';
import { SocialLinksService } from '../../../service/social-links.service';
import { SocialLink } from '../../../models/social-link';

@Component({
  selector: 'app-admin-social-links',
  templateUrl: './admin-social-links.component.html',
})
export class AdminSocialLinksComponent implements OnInit {
  links: SocialLink[] = [];
  saving = false;
  error: string | null = null;

  constructor(private socialLinks: SocialLinksService) {}

  ngOnInit(): void {
    this.socialLinks.links$.subscribe((links) => (this.links = [...links]));
    this.socialLinks.load();
  }

  add() {
    this.links = [...this.links, { label: 'New', url: 'https://', icon: '' }];
  }

  save(link: SocialLink) {
    if (!link.url || !link.label) {
      this.error = 'Label and URL are required.';
      return;
    }
    this.error = null;
    this.saving = true;
    const req$ = link.id
      ? this.socialLinks.update(link.id, link)
      : this.socialLinks.create(link);
    req$.subscribe({
      next: () => (this.saving = false),
      error: () => {
        this.error = 'Failed to save link.';
        this.saving = false;
      },
    });
  }

  remove(link: SocialLink) {
    if (!link.id) {
      this.links = this.links.filter((l) => l !== link);
      return;
    }
    this.socialLinks.delete(link.id).subscribe({
      error: () => (this.error = 'Failed to delete link.'),
    });
  }
}
