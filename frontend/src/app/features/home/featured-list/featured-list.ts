import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'nb-featured-list',
  imports: [CommonModule, RouterLink],
  template: `
    <ul class="featured">
      <li *ngFor="let f of items">
        <a [routerLink]="['/post', f.slug]">
          <img [src]="f.image" alt="" />
          <span class="badge">{{ f.title }}</span>
        </a>
      </li>
    </ul>
  `,
  styles: [
    `
      .featured {
        display: grid;
        gap: 16px;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li {
        position: relative;
        border-radius: 14px;
        overflow: hidden;
      }
      img {
        width: 100%;
        height: 110px;
        object-fit: cover;
        display: block;
      }
      .badge {
        position: absolute;
        left: 12px;
        bottom: 12px;
        background: rgba(63, 81, 181, 0.92);
        color: #fff;
        font-weight: 700;
        padding: 6px 10px;
        border-radius: 6px;
      }
    `,
  ],
})
export class FeaturedListComponent {
  items = input<{ slug: string; title: string; image: string }[]>([]);
}
