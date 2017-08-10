import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerService, I18n } from '../common/datePicker.service';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TextMaskModule } from 'angular2-text-mask';


import { InternFormComponent } from './intern-form.component';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import {PromptComponent } from './prompt.component';
//import { ForgotComponent } from './forgot/forgot.component';
import { AuthGuard } from '../user/auth-guard.service';
import { AuthService } from '../user/auth.service';
import { DepartmentsService } from '../departments/departments.service';
import { FormWizardModule } from 'angular2-wizard';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';



@NgModule({
  declarations: [
    InternFormComponent,
    ImageCropperComponent,
    PromptComponent
    //ForgotComponent,
  ],
  imports: [
    CommonModule,
    BootstrapModalModule,
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
    DepartmentsService
  ],
  bootstrap: [InternFormComponent, PromptComponent]
})
export class InternFormModule { }
