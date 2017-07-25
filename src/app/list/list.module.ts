import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { ListComponent } from './list.component';
//import { ForgotComponent } from './forgot/forgot.component';
import { AuthGuard } from '../user/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forRoot([ { path: '',canActivate:[AuthGuard], component: ListComponent }])
  ],
  declarations: [
    ListComponent,
  ],
  providers: [
  ]
})
export class ListModule {}
