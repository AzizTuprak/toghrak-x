import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },

  {
    path: 'post/:slug',
    loadComponent: () =>
      import('./features/posts/post-detail.component').then((m) => m.PostDetailComponent),
  },
  {
    path: 'category/:slug',
    loadComponent: () =>
      import('./features/categories/category-list.component').then((m) => m.CategoryListComponent),
  },

  // Editor/Admin
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canMatch: [() => import('./core/guards/auth.guard').then((m) => m.authGuard)],
  },

  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/admin/users/users.component').then((m) => m.UsersComponent),
    canMatch: [() => import('./core/guards/role.guard').then((m) => m.roleGuard(['ADMIN']))],
  },

  {
    path: 'editor/posts/new',
    loadComponent: () =>
      import('./features/editor/post-edit.component').then((m) => m.PostEditComponent),
    canMatch: [
      () => import('./core/guards/role.guard').then((m) => m.roleGuard(['EDITOR', 'ADMIN'])),
    ],
  },

  {
    path: 'editor/posts/:id/edit',
    loadComponent: () =>
      import('./features/editor/post-edit.component').then((m) => m.PostEditComponent),
    canMatch: [
      () => import('./core/guards/role.guard').then((m) => m.roleGuard(['EDITOR', 'ADMIN'])),
    ],
  },

  { path: '**', redirectTo: '' },
];
