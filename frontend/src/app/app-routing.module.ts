import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './features/posts/posts-list/posts-list.component';
import { PageViewComponent } from './features/static/page-view/page-view.component';
import { SearchComponent } from './features/static/search/search.component';
import { NotFoundComponent } from './features/static/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: PostsListComponent }, //Home

  {
    path: 'posts',
    loadChildren: () =>
      import('./features/posts/posts.module').then((m) => m.PostsModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'page/:slug', component: PageViewComponent },
  { path: 'search', component: SearchComponent },
  // Category slug route (e.g., /events)
  { path: ':slug', component: PostsListComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
