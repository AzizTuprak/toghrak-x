import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'nb-register',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <h2>Create account</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field"><input placeholder="Username" formControlName="username" /></div>
        <div class="field"><input placeholder="Email" formControlName="email" /></div>
        <div class="field">
          <input type="password" placeholder="Password" formControlName="password" />
        </div>
        <button mat-raised-button color="primary" [disabled]="form.invalid">Register</button>
      </form>
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.auth.register(this.form.value as any).subscribe(() => {
      // after register, go to login
      this.router.navigate(['/login']);
    });
  }
}
