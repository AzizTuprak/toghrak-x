import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageViewComponent } from './page-view.component';
import { PageViewRoutingModule } from './page-view-routing.module';

@NgModule({
  declarations: [PageViewComponent],
  imports: [CommonModule, PageViewRoutingModule],
})
export class PageViewModule {}

