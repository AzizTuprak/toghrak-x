import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './features/posts/posts-list/posts-list.component';
import { PostDetailComponent } from './features/posts/post-detail/post-detail.component';
import { PostFormComponent } from './features/posts/post-form/post-form.component';
import { ProfileComponent } from './features/user/profile/profile.component';
import { AdminUsersComponent } from './features/user/admin/admin-users/admin-users.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: PostsListComponent }, //Home

  { path: 'posts/new', component: PostFormComponent, canActivate: [AuthGuard] },
  {
    path: 'posts/:id/edit',
    component: PostFormComponent,
    canActivate: [AuthGuard],
  },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
