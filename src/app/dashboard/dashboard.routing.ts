import { Routes } from '@angular/router';
import { OnInit } from '@angular/core';

import { AuthGuard } from '../user/auth-guard.service';
import { DashboardComponent } from './dashboard.component';


export const DashboardRoutes: Routes = [{
  path: '',
  canActivate: [AuthGuard],
  component: DashboardComponent,
  data: {
    heading: 'Yönetim Paneli'
  }
}];

/**
 * {
  path: 'appeals',
  loadChildren: './appeals/appeals.module#AppealsModule'
}, {
  path: 'analyzes',
  loadChildren: './analyzes/analyzes.module#AnalyzesModule'
}, {
  path: 'intern',
  loadChildren: './intern/intern.module#InternModule'
}
 */