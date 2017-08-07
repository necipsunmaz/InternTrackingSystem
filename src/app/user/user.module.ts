import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerService, I18n } from '../common/datePicker.service';
import { TextMaskModule } from 'angular2-text-mask';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
//import { ForgotComponent } from './forgot/forgot.component';
import { AuthGuard, IsLoggedIn, IsSuperAdmin, IsAdmin, IsAcedemician } from './auth-guard.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TextMaskModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
      //{ path: 'password', canActivate: [ AuthGuard], component: ForgotComponent },
    ])
  ],
  declarations: [
    SigninComponent,
    SignupComponent,
    //ForgotComponent,
  ],
  providers: [
    DatePickerService,
    I18n,
    AuthService,
    AuthGuard,
    IsLoggedIn,
    IsSuperAdmin,
    IsAdmin,
    IsSuperAdmin,
    IsAcedemician,
    UserService
  ]
})
export class UserModule { }
