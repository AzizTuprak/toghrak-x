import { signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SiteHeaderComponent } from './shared/site-header/site-header';
import { SiteFooterComponent } from './shared/site-footer/site-footer';
import { HeroComponent } from './features/home/hero/hero';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    SiteHeaderComponent,
    SiteFooterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {
  protected readonly title = signal('frontend');
}
