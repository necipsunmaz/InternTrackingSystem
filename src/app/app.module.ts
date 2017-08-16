import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { DialogService } from "ng2-bootstrap-modal";

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';

import { ToastrService } from './common/toastr.service';
import { AuthService } from './user/auth.service';
import { ConfirmComponent } from './common/confirm.component';
import { PromptIntern } from './common/prompts/intern.prompt';
import { PromptAcademician } from './common/prompts/academician.prompt';
import { AuthGuard, IsLoggedIn, IsAdmin, IsSuperAdmin, IsAcedemician } from './user/auth-guard.service';


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ConfirmComponent,
    PromptIntern,
    PromptAcademician
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    BootstrapModalModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [ToastrService, AuthService, AuthGuard, IsLoggedIn, IsAdmin, IsSuperAdmin, IsAcedemician, { provide: LOCALE_ID, useValue: "tr-TR" }],
  entryComponents:[ConfirmComponent, PromptIntern, PromptAcademician],
  bootstrap: [AppComponent]
})
export class AppModule { }

