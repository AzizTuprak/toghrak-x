import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'nb-site-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  template: `
    <mat-toolbar color="primary" class="nb-toolbar">
      <a class="brand" routerLink="/">Logo</a>
      <nav class="nav">
        <a mat-button routerLink="/">Home</a>
        <a mat-button routerLink="/category/history">History</a>
        <a mat-button routerLink="/category/culture">Culture</a>
        <a mat-button routerLink="/category/problems">Problems</a>
        <a mat-button routerLink="/category/events">Events</a>
      </nav>
      <span class="spacer"></span>
      <a mat-button routerLink="/login">LogIn</a>
    </mat-toolbar>
  `,
  styles: [
    `
      .nb-toolbar {
        border-radius: 12px;
        margin: 12px;
      }
      .brand {
        font-weight: 700;
        margin-right: 24px;
        text-decoration: none;
        color: inherit;
      }
      .nav a {
        font-size: 18px;
        font-weight: 600;
      }
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class SiteHeaderComponent {}
