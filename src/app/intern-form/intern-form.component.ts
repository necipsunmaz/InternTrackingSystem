import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { ToastrService } from '../common/toastr.service'
import { InternFormService } from './intern-form.service';
import { DatePickerService, I18n } from '../datepicker/datePicker.service'
import { NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IMyDrpOptions, IMyDateRangeModel, IMyDefaultMonth, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';


@Component({
  selector: 'app-signup',
  templateUrl: './intern-form.component.html',
  styleUrls: ['./intern-form.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: DatePickerService }]
})
export class InternFormComponent implements OnInit {


  constructor(private fb: FormBuilder,
    private ınternService: InternFormService,
    private datePickerService: DatePickerService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private router: Router,
    private _i18n: I18n,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.toDefaultTime(this.SelectedValue);
  }

  // Image Converter Base64  
  public base64textString: String = "";
  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    this.base64textString = 'data:image/png;base64,' + btoa(readerEvt.target.result);
    this.internFormStep1.controls['photo'].setValue(true);
  }

  // Gender SelectBox
  private genderValue: number = null;
  genders: Array<Object> = [
    { num: true, name: 'Erkek' },
    { num: false, name: 'Kadın' }
  ]

  toGender() {
    this.genderValue = this.genderValue;
  }

  //Dob Validation
  private dobValue: NgbDateStruct;

  // Phone Mask
  public myModel = '';
  public mask = ['+', '9', '0', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  //Department Validation
  testDate = new Date('2017-07-27').toISOString();
  tesetDate = new Date('2017-09-27').toISOString();

  testDate1 = new Date('2017-11-27').toISOString();
  tesetDate2 = new Date('2017-12-27').toISOString();

  departments: Array<Object> = [
    { dateRange: this.testDate + '&' + this.tesetDate, name: 'Bilgi İşlem' },
    { dateRange: this.testDate1 + '&' + this.tesetDate2, name: 'Kütüphane' }
  ]

  SelectedValue: string = '2017-11-11&2017-11-11';
  toDefaultTime(selected) {
    let copy = this.getCopyOfOptions();

    copy.disableUntil = selected ? {
      year: new Date(this.SelectedValue.split('&')[0]).getFullYear(),
      month: new Date(this.SelectedValue.split('&')[0]).getMonth(),
      day: new Date(this.SelectedValue.split('&')[0]).getDate()
    } : { year: 0, month: 0, day: 0 };
    this.myDateRangePickerOptionsInline = copy;

    copy.disableSince = selected ? {
      year: new Date(this.SelectedValue.split('&')[1]).getFullYear(),
      month: new Date(this.SelectedValue.split('&')[1]).getMonth(),
      day: new Date(this.SelectedValue.split('&')[1]).getDate()
    } : { year: 0, month: 0, day: 0 };
    this.myDateRangePickerOptionsInline = copy;
  }

  //************************** */
  private myDateRangePickerOptionsInline: IMyDrpOptions = {
    dateFormat: 'dd.mm.yyyy',
    firstDayOfWeek: 'mo',
    selectBeginDateTxt: 'Başlama Tarihi Seçin',
    selectEndDateTxt: 'Bitiş Tarihi Seçin',
    dayLabels: { su: "Pazar", mo: "Pazatesi", tu: "Salı", we: "Çarşamba", th: "Perşembe", fr: "Cuma", sa: "Cumatesi" },
    monthLabels: { 1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan", 5: "Mayıs", 6: "Haziran", 7: "Temmuz", 8: "Ağustos", 9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık" },
    sunHighlight: true,
    inline: true,
    //enableDates: [{year: 2016, month: 11, day: 14}, {year: 2016, month: 11, day: 15}],
    selectorHeight: '530px',
    height: '530px',
    width: '100%',
    selectorWidth: '100%',
    showSelectDateText: true
  };

  sdate = new Date();
  edate = new Date();

  onDateRangeChanged(event: IMyDateRangeModel) {
    //this.sdate.setDate(new Date(event.formatted.split('-')[0]).getDate());
    //this.edate.setFullYear(years: 2016 );
    console.log('Hello');
    console.log('onDateRangeChanged(): Begin date: ', event.beginDate, ' End date: ', event.endDate);
    console.log('onDateRangeChanged(): Formatted: ', event.formatted);
    console.log('onDateRangeChanged(): BeginEpoc timestamp: ', event.beginEpoc, ' - endEpoc timestamp: ', event.endEpoc);
  }

  getCopyOfOptions(): IMyDrpOptions {
    return JSON.parse(JSON.stringify(this.myDateRangePickerOptionsInline));
  }
  //****************************************************** */


  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.email, Validators.required]);
  tc = new FormControl('', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{10}$')]);
  gender = new FormControl('', [Validators.required]);
  dob = new FormControl('', [Validators.required]);
  starteddate = new FormControl('', [Validators.required]);
  endeddate = new FormControl('', [Validators.required]);
  phone = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  photo = new FormControl('', [Validators.requiredTrue]);
  department = new FormControl('', [Validators.required]);
  isComplete = new FormControl('', [Validators.requiredTrue]);
  dateRange = new FormControl('', [Validators.required]);

  internFormStep1: FormGroup = this.fb.group({
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    dob: this.dob,
    gender: this.gender,
    tc: this.tc,
    phone: this.phone,
    address: this.address,
    photo: this.photo
  });

  internFormStep2: FormGroup = this.fb.group({
    starteddate: this.sdate,
    endeddate: this.edate,
    department: this.department,
    dateRange: this.dateRange
  });


  internFormStep3: FormGroup = this.fb.group({
    isComplete: this.isComplete
  });


  saveIntern(formdata: any): void {
    if (this.internFormStep1.dirty && this.internFormStep1.valid && this.internFormStep2.dirty && this.internFormStep2.valid) {
      let theForm = this.internFormStep1.value;
      theForm.photo = this.base64textString;
      theForm.gender = this.genderValue;
      theForm.dob = this.ngbDateParserFormatter.format(this.dobValue);
      theForm.starteddate = this.internFormStep2.value.starteddate;
      theForm.endeddate = this.internFormStep2.value.endeddate;


      this.ınternService.saveIntern(theForm)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
            this.router.navigate(['/user/signin']);
          }
          this.internFormStep1.reset();
          this.internFormStep2.reset();
          this.internFormStep3.reset();
        });
    } else {
      this.internFormStep1.reset();
      this.internFormStep2.reset();
      this.internFormStep3.reset();
      this.toastr.error("Lütfen tüm bilgileri eksiksiz bir şekilde doldurun.");
      this.router.navigate(['/intern-form']);
    }
  }

  onStep1Next(event) {
    console.log('Step1 - Next');
  }

  onStep2Next(event) {
    console.log('Step2 - Next');
  }

  onStep3Next(event) {
    console.log('Step3 - Next');
  }

  onComplete(event) {
    // this.isCompleted = true;
    //this.toastr.success("Staj formu gönderildi.");
    //this.router.navigate(['/user/signin']);
  }

  onStepChanged(step) {
    console.log('Changed to ' + step.title);
  }
}