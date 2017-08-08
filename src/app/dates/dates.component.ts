import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { DepartmentsService } from '../departments/departments.service';
import { Dates } from './dates';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IMyDrpOptions, IMyDateRangeModel, IMyDefaultMonth, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';

@Component({
  selector: 'app-list',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.scss']
})
export class DatesComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private departmentService: DepartmentsService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  // Departments List Array
  dates: Dates[];

  //Department Validation
  SelectedValue: string = '2016-11-11&2017-11-11';
  toDay = new Date();
  toDefaultTime(selected) {
    let copy = this.getCopyOfOptions();

    copy.disableSince = selected ? {
      year: new Date(this.SelectedValue.split('&')[0]).getFullYear(),
      month: new Date(this.SelectedValue.split('&')[0]).getMonth(),
      day: new Date(this.SelectedValue.split('&')[0]).getDate()
    } : {
        year: 0,
        month: 0,
        day: 0
      };
    this.myDateRangePickerOptionsInline = copy;


    copy.enableDates = selected ? [{
      year: new Date(this.SelectedValue.split('&')[0]).getFullYear(),
      month: new Date(this.SelectedValue.split('&')[0]).getMonth() - 3,
      day: new Date(this.SelectedValue.split('&')[0]).getDate()
    }] : [{
      year: new Date(this.SelectedValue.split('&')[1]).getFullYear(),
      month: new Date(this.SelectedValue.split('&')[1]).getMonth() - 3,
      day: new Date(this.SelectedValue.split('&')[1]).getDate()
    }];
    this.myDateRangePickerOptionsInline = copy;
/*
    copy.disableSince = selected ? {
      year: new Date(this.SelectedValue.split('&')[1]).getFullYear(),
      month: new Date(this.SelectedValue.split('&')[1]).getMonth(),
      day: new Date(this.SelectedValue.split('&')[1]).getDate()
    } : { year: 0, month: 0, day: 0 };
    this.myDateRangePickerOptionsInline = copy;
 */ }

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
    minYear: this.toDay.getFullYear() - 2,
    maxYear: this.toDay.getFullYear() + 2,
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
    this.sdate.setDate(event.beginJsDate.getDate());
    this.edate.setDate(event.endJsDate.getDate());
    //console.log('onDateRangeChanged(): Begin date: ', event.beginDate, ' End date: ', event.endDate);
    //console.log('onDateRangeChanged(): Formatted: ', event.formatted + event.beginJsDate + "--" + event.endJsDate);
    //console.log('onDateRangeChanged(): BeginEpoc timestamp: ', event.beginEpoc, ' - endEpoc timestamp: ', event.endEpoc);
  }

  getCopyOfOptions(): IMyDrpOptions {
    return JSON.parse(JSON.stringify(this.myDateRangePickerOptionsInline));
  }
  //****************************************************** */


  _id = new FormControl('', [Validators.pattern('^[0-9a-fA-F]{24}$')]);
  dateRange = new FormControl('', [Validators.required]);

  datesForm: FormGroup = this.fb.group({
    _id: this._id,
    dateRange: this.dateRange
  });

  onSubmit(): void {
    this.fetchReport();
    //this.toDefaultTime(this.SelectedValue);
  }

  ngOnInit() {
    this.fetchReport();
    // this.toDefaultTime(this.SelectedValue);
  }

  saveDepartmentDates(formdata: any): void {
    if (this.datesForm.dirty && this.datesForm.valid) {
      let theForm = this.datesForm.value;
      theForm.starteddate = this.sdate;
      theForm.endeddate = this.edate;
      delete theForm.dateRange;

      this.departmentService.saveDepartmentDate(0, theForm)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
          }
          this.datesForm.reset();
          this.fetchReport();
        });
    } else {
      this.datesForm.reset();
      this.toastr.error("Lütfen tüm bilgileri eksiksiz bir şekilde doldurun.");
    }
  }



  fetchReport() {
    this.departmentService.getDepartmentDate().subscribe(data => {
      if (data.success === false) {
        if (data.errcode) {
          this.authService.logout();
          this.router.navigate(['login']);
        }
        this.toastr.error(data.message);
      } else {
        this.dates = data.data;
      }
    });
  }

  updateDepartmentDates(_id) {
    let theForm = { starteddate: null, endeddate: null };
    this.departmentService.saveDepartmentDate(_id, theForm).subscribe(data => {
      if (data.success === false) {
        this.toastr.error(data.message);
      } else {
        this.toastr.success(data.message);
        this.fetchReport();
      }
    });
  }

  deleteDepartment(_id, rowIndex: number) {
    let theForm = { _id:_id, starteddate: null, endeddate: null };
    this.departmentService.saveDepartmentDate(1, theForm).subscribe(date => {
      if (date.success === false) {
        if (date.errcode) {
          this.authService.logout();
          this.router.navigate(['login']);
        }
        this.toastr.error(date.message);
      } else {
        this.toastr.success(date.message);
        this.dates.splice(rowIndex, 1);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
} 