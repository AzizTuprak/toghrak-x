import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'nb-section-grid',
  imports: [RouterLink],
  template: `
    <h3 class="section-title">{{ title }}</h3>
    <div class="grid">
      <article *ngFor="let p of posts">
        <a [routerLink]="['/post', p.slug]">
          <img [src]="p.image" alt="" />
          <h4>{{ p.title }}</h4>
          <div class="meta">
            <span>{{ p.date | date : 'MMM d, y' }}</span>
            <span>Admin</span>
            <span>{{ category }}</span>
          </div>
        </a>
      </article>
    </div>
  `,
  styles: [
    `
      .section-title {
        margin: 28px 0 10px;
        background: #bcd0ff;
        display: inline-block;
        padding: 6px 10px;
        border-radius: 6px;
      }
      .grid {
        display: grid;
        gap: 22px;
        grid-template-columns: repeat(3, 1fr);
      }
      article {
        border-radius: 16px;
        overflow: hidden;
        background: #fff;
      }
      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        display: block;
      }
      h4 {
        margin: 10px 12px 4px;
        font-weight: 800;
      }
      .meta {
        color: #555;
        font-size: 12px;
        display: flex;
        gap: 12px;
        margin: 0 12px 12px;
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 600px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SectionGridComponent {
  title = input<string>('');
  category = input<string>('');
  posts = input<{ slug: string; title: string; image: string; date: string | Date }[]>([]);
}
