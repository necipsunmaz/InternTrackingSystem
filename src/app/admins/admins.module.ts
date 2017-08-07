import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AdminsRoutes } from './admins.routing';
import { AdminsComponent } from './admins.component';

// Services
import { AuthGuard } from '../user/auth-guard.service';
import { UserService } from '../user/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    ReactiveFormsModule,
    RouterModule.forChild(AdminsRoutes),
    NgxDatatableModule
  ],
  declarations: [
    AdminsComponent
  ], providers: [
    UserService
  ]
})

export class AdminsModule { }