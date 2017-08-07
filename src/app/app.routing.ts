import { Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthGuard, IsLoggedIn, IsSuperAdmin } from './user/auth-guard.service';
import { Router } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AuthService } from './user/auth.service';

export const AppRoutes: Routes = [{
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: 'user',
    resolve: [IsLoggedIn],
    loadChildren: './user/user.module#UserModule'
  }, {
    path: 'error',
    loadChildren: './error/error.module#ErrorModule'
  }, {
    path: 'intern-form',
    loadChildren: './intern-form/intern-form.module#InternFormModule'
  }]
}, {
  path: '',
  component: AdminLayoutComponent,
  //resolve:[IsSuperAdmin],
  children: [{
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  }, {
    path: 'appeals',
    loadChildren: './appeals/appeals.module#AppealsModule'
  }, {
    path: 'analyzes',
    loadChildren: './analyzes/analyzes.module#AnalyzesModule'
  }, {
    path: 'intern',
    loadChildren: './intern/intern.module#InternModule'
  },{
    path: 'departments',
    loadChildren: './departments/departments.module#DepartmentsModule'
  }, {
    path: 'admins',
    loadChildren: './admins/admins.module#AdminsModule'
  }, {
    path: 'dates',
    loadChildren: './dates/dates.module#DatesModule'
  }]
}, {
  path: '**',
  redirectTo: 'error/404'
}];