import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './service/user.service';
import { User, CreateUserRequest } from './models/user';
import { LoginComponent } from './features/auth/login/login.component';
import { PostsListComponent } from './features/posts/posts-list/posts-list.component';
import { PostDetailComponent } from './features/posts/post-detail/post-detail.component';
import { PostFormComponent } from './features/posts/post-form/post-form.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProfileComponent } from './features/user/profile/profile.component';
import { AdminUsersComponent } from './features/user/admin/admin-users/admin-users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PostsListComponent,
    PostDetailComponent,
    PostFormComponent,
    ProfileComponent,
    AdminUsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
