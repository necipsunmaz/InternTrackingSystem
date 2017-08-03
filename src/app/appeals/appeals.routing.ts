import { Routes } from '@angular/router';

import { AppealsComponent } from './appeals.component';
import { AuthGuard, IsAdmin } from '../user/auth-guard.service';

export const AppealsRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard, IsAdmin],
        component: AppealsComponent,
        data: {
            heading: 'Başvurular'
        }

    }
];
