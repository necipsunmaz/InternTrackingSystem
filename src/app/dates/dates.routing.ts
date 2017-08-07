import { Routes } from '@angular/router';

import { DatesComponent } from './dates.component';
import { AuthGuard, IsAdmin } from '../user/auth-guard.service';

export const DatesRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard, IsAdmin],
        component: DatesComponent,
        data: {
            heading: 'Başvurular'
        }

    }
];
