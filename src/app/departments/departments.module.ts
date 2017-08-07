import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DepartmentsRoutes } from './departments.routing';
import { DepartmentsComponent } from './departments.component';

// Services
import { AuthGuard } from '../user/auth-guard.service';
import { DepartmentsService } from './departments.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    ReactiveFormsModule,
    RouterModule.forChild(DepartmentsRoutes),
    NgxDatatableModule
  ],
  declarations: [
    DepartmentsComponent
  ], providers: [
    DepartmentsService
  ]
})

export class DepartmentsModule { }