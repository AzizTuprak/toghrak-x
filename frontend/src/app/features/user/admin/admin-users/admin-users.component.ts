import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { User, CreateUserRequest } from '../../../../models/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  form: CreateUserRequest = {
    username: '',
    email: '',
    password: '',
    roleName: 'EDITOR',
  };
  saving = false;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.loading = false;
      },
    });
  }

  create() {
    if (this.saving) return;
    this.saving = true;
    this.error = null;
    this.userService.create(this.form).subscribe({
      next: () => {
        this.form = {
          username: '',
          email: '',
          password: '',
          roleName: 'EDITOR',
        };
        this.fetch();
        this.saving = false;
      },
      error: () => {
        this.error = 'Failed to create user.';
        this.saving = false;
      },
    });
  }

  delete(id: number) {
    if (!confirm('Delete user?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.fetch(),
      error: () => (this.error = 'Failed to delete user.'),
    });
  }
}
