import { Routes } from '@angular/router';

import { AnalyzesComponent } from './analyzes.component';
import { AuthGuard } from '../user/auth-guard.service';

export const AnalyzesRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: AnalyzesComponent,
        data: {
            heading: 'Analizler'
        }

    }
];
