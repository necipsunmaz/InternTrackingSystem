import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { DatesRoutes } from './dates.routing';
import { DatesComponent } from './dates.component';
import { ConfirmComponent } from '../common/confirm.component';

// Services
import { AuthGuard } from '../user/auth-guard.service';
import { DepartmentsService } from '../departments/departments.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    ReactiveFormsModule,
    BootstrapModalModule,
    MyDateRangePickerModule,
    RouterModule.forChild(DatesRoutes),
    NgxDatatableModule
  ],
  declarations: [
    DatesComponent,
    ConfirmComponent
  ], entryComponents: [
    ConfirmComponent
  ], providers: [
    DepartmentsService
  ]
})

export class DatesModule { }