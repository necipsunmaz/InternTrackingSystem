import { Routes } from '@angular/router';
import { AuthGuard } from '../../user/auth-guard.service';

import { TrackingComponent } from './tracking/tracking.component';
import { ProfileComponent } from './profile/profile.component';
import { AnalysisComponent } from './calendar/calendar.component';

export const InternRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'profile',
            component: ProfileComponent,
            data: {
                heading: 'Profil'
            }
        }, {
            path: 'tracking',
            component: TrackingComponent,
            data: {
                heading: 'Devam/Devamsızlık Listesi'
            }
        }, {
            path: 'calendar',
            component: AnalysisComponent,
            data: {
                heading: 'Devam/Devamsızlık Takvimi'
            }
        }]
    }
];
