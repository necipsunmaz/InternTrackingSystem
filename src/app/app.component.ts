import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { ToastrService } from './common/toastr.service';


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(translate: TranslateService,private router: Router,
    private toastr: ToastrService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}
