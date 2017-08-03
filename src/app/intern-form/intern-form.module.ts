import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerService, I18n } from '../datepicker/datePicker.service';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TextMaskModule } from 'angular2-text-mask';


import { InternFormComponent } from './intern-form.component';
//import { ForgotComponent } from './forgot/forgot.component';
import { AuthGuard } from '../user/auth-guard.service';
import { AuthService } from '../user/auth.service';
import { InternFormService } from './intern-form.service';
import { FormWizardModule } from 'angular2-wizard';


@NgModule({
  declarations: [
    InternFormComponent
    //ForgotComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TextMaskModule,
    FormWizardModule,
    ReactiveFormsModule,
    MyDateRangePickerModule,
    RouterModule.forChild([
      { path: '', component: InternFormComponent }
      //{ path: 'password', canActivate: [ AuthGuard], component: ForgotComponent },
    ])
  ],
  providers: [
    DatePickerService,
    I18n,
    AuthService,
    AuthGuard,
    InternFormService
  ],
  bootstrap: [InternFormComponent]
})
export class InternFormModule { }
