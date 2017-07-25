import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AnalyzesRoutes } from './analyzes.routing';
import { AnalyzesComponent } from './analyzes.component';

// Services
import { AuthGuard } from '../user/auth-guard.service';
import { InternService } from '../intern/intern.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AnalyzesRoutes),
    NgxChartsModule
  ],
  declarations: [
    AnalyzesComponent
  ],providers: [
    InternService
  ]
})

export class AnalyzesModule {}