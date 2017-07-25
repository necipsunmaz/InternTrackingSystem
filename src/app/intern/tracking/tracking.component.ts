import { Component, ViewChild, OnInit, Injectable } from '@angular/core';
import { AuthService } from '../../user/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../common/toastr.service';
import { InternService } from '../intern.service';
import { IIntern } from '../intern';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';


const now = new Date();
const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  fr: {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  },
  tr: {
    weekdays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    months: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  }
};

// Define a service holding the language. You probably already have one if your app is i18ned.
@Injectable()
export class I18n {
  language = 'tr';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}


@Component({
  selector: 'app-table-filter',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})


export class TrackingComponent {
  rows = [];

  temp = [];

  @ViewChild('datatable') datatable;

  columns = [
    { prop: 'İsim' },
    { name: 'Soyisim' },
    { name: 'Cinsiyet' },
    { name: 'Email' },
    { name: 'TC' },
    { name: 'Doğum Tarihi' },
    { name: 'Staj Başlama' },
    { name: 'Staj Bitirme' }
  ];

  radioItems = ['Gün', 'Ay', 'Hafta'];
  model = { options: 'Gün' };

  constructor(private authService: AuthService,
    private internService: InternService,
    private route: ActivatedRoute,
    private router: Router,
    private _i18n: I18n,
    private toastr: ToastrService, ) {
  }



  d: any;
  d2: any;
  d3: any;
  model2: NgbDateStruct;
  popupModel;
  date: { year: number, month: number };
  displayMonths = 2;
  navigation = 'select';
  disabledModel: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  disabled = true;
  intModel;
  customModel: NgbDateStruct;

  set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    return this._i18n.language;
  }

  selectToday() {
    this.model2 = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }


  interns: IIntern[];
  userObj: any;

  toApisUnderstand(data: string): string {
    switch (data) {
      case 'Gün': return 'day';
      case 'Hafta': return 'week';
      case 'Ay': return 'month';
    }
  }

  listRefresh() {
    this.fetch((data) => {
      // cache our list
      this.temp = [...data];
      // push our inital complete list
      this.rows = data;
    });
  }
  fetch(cb) {
    this.internService.getInternsByOption(this.toApisUnderstand(this.model.options))
      .subscribe(data => {
        if (data.success === false) {
          if (data.errcode) {
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          cb(data.data);
        }
      });
  }

  ngOnInit() {
    this.userObj = this.authService.currentUser;
    this.listRefresh();
    this.selectToday();
  }

  updateFilter(event) {
    const val = event.target.value;
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.firstname.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
  }
}
