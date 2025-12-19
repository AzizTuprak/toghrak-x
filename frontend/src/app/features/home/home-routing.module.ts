import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from '../posts/posts-list/posts-list.component';

const routes: Routes = [
  { path: '', component: PostsListComponent }, // Home
  // Category slug route (e.g., /events)
  { path: ':slug', component: PostsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
