import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'nb-dashboard',
  imports: [CommonModule],
  template: `
    <h1>Dashboard</h1>
    <p>Welcome! This is a placeholder dashboard for authenticated users.</p>
  `,
})
export class DashboardComponent {}
