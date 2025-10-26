import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'nb-hero',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero">
      <a *ngIf="link; else plain" [routerLink]="link">
        <img *ngIf="image" [src]="image" alt="" />
        <h2>{{ title }}</h2>
      </a>
      <ng-template #plain>
        <img *ngIf="image" [src]="image" alt="" />
        <h2>{{ title }}</h2>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .hero img {
        width: 100%;
        height: auto;
        display: block;
      }
      .hero h2 {
        margin: 8px 0 0;
        font-size: 1.4rem;
      }
    `,
  ],
})
export class HeroComponent {
  @Input() image?: string | null;
  @Input() title = '';
  @Input() link?: any;
}
