import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/Forms';
import { HttpClientModule } from '@angular/common/http';
import { NewsapiservicesService} from './service/newsapiservices.service';
import { TopheadingComponent } from './components/topheading/topheading.component';
import { TechnewsComponent } from './components/technews/technews.component';
import { BusinessnewsComponent } from './components/businessnews/businessnews.component';
import { UyghurnewsComponent } from './components/uyghurnews/uyghurnews.component';
@NgModule({
  declarations: [
    AppComponent,
    TopheadingComponent,
    TechnewsComponent,
    BusinessnewsComponent,
    UyghurnewsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [NewsapiservicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
