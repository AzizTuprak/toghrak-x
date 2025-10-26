import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/users.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'nb-admin-users',
  imports: [CommonModule, MatPaginatorModule],
  template: `
    <h1>Users</h1>
    <table class="tbl" *ngIf="rows().length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let u of rows()">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
        </tr>
      </tbody>
    </table>
    <p *ngIf="!rows().length">No users.</p>

    <mat-paginator
      [length]="total()"
      [pageIndex]="page()"
      [pageSize]="size()"
      (page)="change($event)"
    ></mat-paginator>
  `,
  styles: [
    `
      .tbl {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
      }
    `,
  ],
})
export class UsersComponent {
  private svc = inject(UsersService);
  rows = signal<any[]>([]);
  total = signal(0);
  page = signal(0);
  size = signal(10);

  ngOnInit() {
    this.load();
  }
  load() {
    this.svc.list(this.page(), this.size()).subscribe((pg) => {
      this.rows.set(pg.content);
      this.total.set(pg.totalElements);
    });
  }
  change(ev: PageEvent) {
    this.page.set(ev.pageIndex);
    this.size.set(ev.pageSize);
    this.load();
  }
}
