import { Routes } from '@angular/router';

import { DepartmentsComponent } from './departments.component';
import { AuthGuard, IsSuperAdmin } from '../user/auth-guard.service';

export const DepartmentsRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard, IsSuperAdmin],
        component: DepartmentsComponent,
        data: {
            heading: 'Başvurular'
        }

    }
];
