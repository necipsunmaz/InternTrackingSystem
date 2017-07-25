import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { DatePickerService, I18n } from '../DatePicker/DatePicker.service'


import { InternService } from './intern.service';
import { AuthLayoutComponent } from '../layouts/auth/auth-layout.component';
import { FormWizardModule } from 'angular2-wizard';

/* App Root */
import { InternFormComponent } from './intern-form.component';

@NgModule({
  declarations: [InternFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FileUploadModule,
    RouterModule.forChild([
      { path: '', component: InternFormComponent }
      //{ path: 'password', canActivate: [ AuthGuard], component: ForgotComponent },
    ]),
    FormWizardModule
  ],
  providers: [InternService, DatePickerService, I18n],
  bootstrap: [InternFormComponent]
})

export class InternFormModule { }