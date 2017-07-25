import { Routes } from '@angular/router';

import { AppealsComponent } from './appeals.component';
import { AuthGuard } from '../user/auth-guard.service';

export const AppealsRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: AppealsComponent,
        data: {
            heading: 'Başvurular'
        }

    }
];
