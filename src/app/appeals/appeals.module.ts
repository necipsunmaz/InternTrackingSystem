import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { PromptIntern } from '../common/prompts/intern.prompt';
import { PromptAcademician } from '../common/prompts/academician.prompt';

import { AppealsRoutes } from './appeals.routing';
import { AcademicianComponent } from './academician/academician.component';
import { InternComponent } from './intern/intern.component';

// Services
import { AuthGuard } from '../user/auth-guard.service';
import { InternService } from '../intern/intern.service';
import { UserService } from '../user/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    RouterModule.forChild(AppealsRoutes),
    NgxDatatableModule
  ],
  declarations: [
    AcademicianComponent,
    InternComponent
  ],
   providers: [
    InternService,
    UserService
  ],
  bootstrap: [InternComponent]
})

export class AppealsModule { }