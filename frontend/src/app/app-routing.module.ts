import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessnewsComponent } from './components/businessnews/businessnews.component';
import { TechnewsComponent } from './components/technews/technews.component';
import { TopheadingComponent } from './components/topheading/topheading.component';
import { UyghurnewsComponent } from './components/uyghurnews/uyghurnews.component';

const routes: Routes = [
  {path:'',component:TopheadingComponent}, //Home
  {path:'tech',component:TechnewsComponent}, //TechNews
  {path:'business',component:BusinessnewsComponent}, //Business
  {path: 'uyghurnews', component: UyghurnewsComponent}, //Uyghurnews
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
