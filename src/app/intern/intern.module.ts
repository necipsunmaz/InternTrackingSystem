import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, CalendarDateFormatter } from 'angular-calendar';

import { AuthGuard } from '../user/auth-guard.service';
import { AuthService } from '../user/auth.service';
import { InternService } from './intern.service';

import { InternRoutes } from './intern.routing';

import { AnalysisComponent } from './calendar/calendar.component';
import { TrackingComponent } from './tracking/tracking.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgxChartsModule,
    CalendarModule.forRoot(),
    NgbProgressbarModule,
    RouterModule.forChild(InternRoutes)
  ],
  declarations: [
    AnalysisComponent,
    TrackingComponent,
    ProfileComponent
  ],
  providers: [
    DatePipe,
    AuthService,
    AuthGuard,
    InternService
  ]
})
export class InternModule {}
