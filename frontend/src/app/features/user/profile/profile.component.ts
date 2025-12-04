import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user?: User;
  loading = false;
  error: string | null = null;

  constructor(private users: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.users.getMe().subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile.';
        this.loading = false;
      },
    });
  }
}
