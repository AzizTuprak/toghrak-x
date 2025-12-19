import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PostsRoutingModule } from './posts-routing.module';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostFormComponent } from './post-form/post-form.component';

@NgModule({
  declarations: [PostDetailComponent, PostFormComponent],
  imports: [CommonModule, ReactiveFormsModule, PostsRoutingModule],
})
export class PostsModule {}

