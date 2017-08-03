import { Routes } from '@angular/router';

import { AnalyzesComponent } from './analyzes.component';
import { AuthGuard, IsAdmin } from '../user/auth-guard.service';

export const AnalyzesRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard, IsAdmin],
        component: AnalyzesComponent,
        data: {
            heading: 'Analizler'
        }

    }
];
