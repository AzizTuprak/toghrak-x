import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'nb-hero',
  imports: [RouterLink],
  template: `
    <section class="hero" *ngIf="image">
      <img [src]="image" alt="" />
      <a [routerLink]="link" class="overlay">
        <h2>{{ title }}</h2>
      </a>
    </section>
  `,
  styles: [
    `
      .hero {
        position: relative;
        border-radius: 18px;
        overflow: hidden;
      }
      .hero img {
        width: 100%;
        height: 260px;
        object-fit: cover;
        display: block;
      }
      .overlay {
        position: absolute;
        left: 20px;
        bottom: 20px;
        background: rgba(63, 81, 181, 0.9);
        color: #fff;
        padding: 8px 14px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 700;
      }
    `,
  ],
})
export class HeroComponent {
  image = input<string>();
  title = input<string>();
  link = input<any[] | string>();
}
