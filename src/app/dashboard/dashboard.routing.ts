import { Routes } from '@angular/router';

import { AuthGuard } from '../user/auth-guard.service';
import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [{
  path: '',
  canActivate:[AuthGuard],
  component: DashboardComponent,
  data: {
    heading: 'Genel İstatistikler'
  }
}];
