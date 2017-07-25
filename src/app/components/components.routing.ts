import { Routes } from '@angular/router';

import { ButtonsComponent } from './buttons/buttons.component';
import { ProgressComponent } from './progress/progress.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SpinnersComponent } from './spinners/spinners.component';
import { AccordionComponent } from './accordion/accordion.component';
import { AlertComponent } from './alert/alert.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CollapseComponent } from './collapse/collapse.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ModalComponent } from './modal/modal.component';
import { PopoverComponent } from './popover/popover.component';
import { RatingComponent } from './rating/rating.component';
import { TabsComponent } from './tabs/tabs.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { ButtonIconsComponent } from './button-icons/button-icons.component';

export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'buttons',
      component: ButtonsComponent,
      data: {
        heading: 'Buttons'
      }
    }, {
      path: 'buttonicons',
      component: ButtonIconsComponent,
      data: {
        heading: 'Social Button Icons'
      }
    }, {
      path: 'progress',
      component: ProgressComponent,
      data: {
        heading: 'Progress bars'
      }
    }, {
      path: 'pagination',
      component: PaginationComponent,
      data: {
        heading: 'Pagination'
      }
    }, {
      path: 'spinners',
      component: SpinnersComponent,
      data: {
        heading: 'Spinner'
      }
    }, {
      path: 'accordion',
      component: AccordionComponent,
      data: {
        heading: 'Accordion'
      }
    }, {
      path: 'alert',
      component: AlertComponent,
      data: {
        heading: 'Alert'
      }
    }, {
      path: 'carousel',
      component: CarouselComponent,
      data: {
        heading: 'Carousel'
      }
    }, {
      path: 'collapse',
      component: CollapseComponent,
      data: {
        heading: 'Collapse'
      }
    }, {
      path: 'datepicker',
      component: DatepickerComponent,
      data: {
        heading: 'Datepicker'
      }
    }, {
      path: 'dropdown',
      component: DropdownComponent,
      data: {
        heading: 'Dropdown'
      }
    }, {
      path: 'modal',
      component: ModalComponent,
      data: {
        heading: 'Modal'
      }
    }, {
      path: 'popover',
      component: PopoverComponent,
      data: {
        heading: 'Popovers'
      }
    }, {
      path: 'rating',
      component: RatingComponent,
      data: {
        heading: 'Rating'
      }
    }, {
      path: 'tabs',
      component: TabsComponent,
      data: {
        heading: 'Tabs'
      }
    }, {
      path: 'timepicker',
      component: TimepickerComponent,
      data: {
        heading: 'Timepicker'
      }
    }, {
      path: 'tooltip',
      component: TooltipComponent,
      data: {
        heading: 'Tooltips'
      }
    }, {
      path: 'typeahead',
      component: TypeaheadComponent,
      data: {
        heading: 'Typeahead'
      }
    }]
  }
];
