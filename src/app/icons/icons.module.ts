import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsRoutes } from './icons.routing';
import { LineaComponent } from './linea/linea.component';
import { FontawesomeComponent } from './fontawesome/fontawesome.component';
import { SliComponent } from './sli/sli.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(IconsRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LineaComponent, FontawesomeComponent, SliComponent]
})

export class IconsModule {}
