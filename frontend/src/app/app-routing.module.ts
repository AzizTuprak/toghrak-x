import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './features/posts/posts-list/posts-list.component';
import { PostDetailComponent } from './features/posts/post-detail/post-detail.component';
import { PostFormComponent } from './features/posts/post-form/post-form.component';
import { ProfileComponent } from './features/user/profile/profile.component';
import { AdminUsersComponent } from './features/user/admin/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './features/admin/admin-categories/admin-categories.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RoleGuard } from './guards/role.guard';
import { PageViewComponent } from './features/static/page-view/page-view.component';
import { AdminPagesComponent } from './features/admin/admin-pages/admin-pages.component';
import { AdminSocialLinksComponent } from './features/admin/admin-social-links/admin-social-links.component';
import { SearchComponent } from './features/static/search/search.component';
import { AdminBrandingComponent } from './features/admin/admin-branding/admin-branding.component';
import { AlreadyAuthGuard } from './guards/already-auth.guard';

const routes: Routes = [
  { path: '', component: PostsListComponent }, //Home

  { path: 'posts/new', component: PostFormComponent, canActivate: [AuthGuard] },
  {
    path: 'posts/:id/edit',
    component: PostFormComponent,
    canActivate: [AuthGuard],
  },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'login', component: LoginComponent, canActivate: [AlreadyAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/categories',
    component: AdminCategoriesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/pages',
    component: AdminPagesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/social-links',
    component: AdminSocialLinksComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/branding',
    component: AdminBrandingComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'page/:slug', component: PageViewComponent },
  { path: 'search', component: SearchComponent },
  // Category slug route (e.g., /events)
  { path: ':slug', component: PostsListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
