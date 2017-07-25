import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService} from './user/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(translate: TranslateService,
  public authService : AuthService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}
