import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { LandingComponent } from './landing.component';
import { LandingRoutes } from './landing.routing';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(LandingRoutes), NgbCarouselModule],
  declarations: [LandingComponent]
})

export class LandingModule {}
