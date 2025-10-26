import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'nb-login',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, RouterLink],
  template: `
    <mat-card>
      <h2>Sign in</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field"><input placeholder="Email" formControlName="email" /></div>
        <div class="field">
          <input type="password" placeholder="Password" formControlName="password" />
        </div>
        <button mat-raised-button color="primary" [disabled]="form.invalid">Login</button>
      </form>
      <a routerLink="/register">Create an account</a>
    </mat-card>
  `,
  styles: [
    `
      .field {
        margin: 12px 0;
      }
      input {
        width: 100%;
        padding: 10px;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.auth.login(this.form.value as any).subscribe((res) => {
      this.auth.saveSession(res);
      this.router.navigate(['/']);
    });
  }
}
