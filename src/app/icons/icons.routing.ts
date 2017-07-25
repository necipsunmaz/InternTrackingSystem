import { Routes } from '@angular/router';

import { LineaComponent } from './linea/linea.component';
import { FontawesomeComponent } from './fontawesome/fontawesome.component';
import { SliComponent } from './sli/sli.component';

export const IconsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'linea',
      component: LineaComponent,
      data: {
        heading: 'Linea Icons'
      }
    }, {
      path: 'fontawesome',
      component: FontawesomeComponent,
      data: {
        heading: 'FontAwesome Icons'
      }
    }, {
      path: 'sli',
      component: SliComponent,
      data: {
        heading: 'Simple Line Icons'
      }
    }]
  }
];
