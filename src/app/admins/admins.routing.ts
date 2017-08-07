import { Routes } from '@angular/router';

import { AdminsComponent } from './admins.component';
import { AuthGuard, IsSuperAdmin } from '../user/auth-guard.service';

export const AdminsRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard, IsSuperAdmin],
        component: AdminsComponent,
        data: {
            heading: 'Başvurular'
        }

    }
];
