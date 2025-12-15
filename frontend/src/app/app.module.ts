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
import { AdminCategoriesComponent } from './features/admin/admin-categories/admin-categories.component';
import { PageViewComponent } from './features/static/page-view/page-view.component';
import { AdminPagesComponent } from './features/admin/admin-pages/admin-pages.component';
import { AdminSocialLinksComponent } from './features/admin/admin-social-links/admin-social-links.component';
import { SearchComponent } from './features/static/search/search.component';
import { AdminBrandingComponent } from './features/admin/admin-branding/admin-branding.component';
import { AlreadyAuthGuard } from './guards/already-auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PostsListComponent,
    PostDetailComponent,
    PostFormComponent,
    ProfileComponent,
    AdminUsersComponent,
    AdminCategoriesComponent,
    PageViewComponent,
    AdminPagesComponent,
    AdminSocialLinksComponent,
    AdminBrandingComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AlreadyAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
