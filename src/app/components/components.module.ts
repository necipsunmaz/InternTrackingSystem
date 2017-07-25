import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ComponentsRoutes } from './components.routing';
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule
  ],
  declarations: [
    ButtonsComponent,
    ProgressComponent,
    PaginationComponent,
    SpinnersComponent,
    AccordionComponent,
    AlertComponent,
    CarouselComponent,
    CollapseComponent,
    DatepickerComponent,
    DropdownComponent,
    ModalComponent,
    PopoverComponent,
    RatingComponent,
    TabsComponent,
    TimepickerComponent,
    TooltipComponent,
    TypeaheadComponent,
    ButtonIconsComponent
  ]
})

export class ComponentsModule {}

