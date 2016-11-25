import { Component } from '@angular/core';

import { ApiService } from './shared';
import { TranslateService } from 'ng2-translate';

import '../style/app.scss';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  url = 'https://github.com/preboot/angular2-webpack';

  constructor(private api: ApiService, private translate: TranslateService) {
    // Do something with api
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
