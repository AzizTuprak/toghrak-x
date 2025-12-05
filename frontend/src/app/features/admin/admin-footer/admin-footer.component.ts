import { Component, OnInit } from '@angular/core';
import { FooterService, FooterLink } from '../../../service/footer.service';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
})
export class AdminFooterComponent implements OnInit {
  links: FooterLink[] = [];
  error: string | null = null;

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.links$.subscribe((links) => (this.links = [...links]));
  }

  addLink() {
    this.links = [...this.links, { label: 'New link', route: '/' }];
  }

  remove(index: number) {
    this.links = this.links.filter((_, i) => i !== index);
    this.save();
  }

  save() {
    if (!this.links.length) {
      this.error = 'At least one link is required.';
      return;
    }
    this.error = null;
    this.footerService.update(this.links);
  }

  reset() {
    this.footerService.reset();
  }
}
