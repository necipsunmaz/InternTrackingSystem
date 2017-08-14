import { Routes } from '@angular/router';

import { AcademicianComponent } from './academician/academician.component';
import { InternComponent } from './intern/intern.component';
import { AuthGuard, IsAdmin } from '../user/auth-guard.service';

export const AppealsRoutes: Routes = [
    {
        path: 'academician',
        canActivate: [AuthGuard, IsAdmin],
        component: AcademicianComponent,
        data: {
            heading: 'Akademisyan Başvuruları'
        }

    }, {
        path: 'intern',
        canActivate: [AuthGuard, IsAdmin],
        component: InternComponent,
        data: {
            heading: 'Stajyer Başvuruları'
        }

    }

];
