import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppealsRoutes } from './appeals.routing';
import { AppealsComponent } from './appeals.component';

// Services
import { AuthGuard } from '../user/auth-guard.service';
import { InternService } from '../intern/intern.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AppealsRoutes),
    NgxDatatableModule
  ],
  declarations: [
    AppealsComponent
  ],providers: [
    InternService
  ]
})

export class AppealsModule {}