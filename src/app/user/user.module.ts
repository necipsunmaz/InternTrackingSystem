import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
//import { ForgotComponent } from './forgot/forgot.component';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    AuthService,
    AuthGuard,
    UserService
  ]
})
export class UserModule {}
