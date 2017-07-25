import { Routes } from '@angular/router';
import { AuthGuard } from './user/auth-guard.service';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [{
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: '',
    loadChildren: './landing/landing.module#LandingModule'
  }, {
    path: 'user',
    loadChildren: './user/user.module#UserModule'
  }, {
    path: 'intern-form',
    loadChildren: './intern-form/intern-form.module#InternFormModule'
  }]
}, {
  path: '',
  component: AdminLayoutComponent,
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
    path: 'components',
    loadChildren: './components/components.module#ComponentsModule'
  }, {
    path: 'intern',
    loadChildren: './intern/intern.module#InternModule'
  }]
}, {
  path: '**',
  redirectTo: 'error/404'
}];

