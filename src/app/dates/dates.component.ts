import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { DepartmentsService } from '../departments/departments.service';
import { Dates } from './dates';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../common/confirm.component';
import { DialogService } from "ng2-bootstrap-modal";
import { IMyDrpOptions, IMyDateRangeModel } from 'mydaterangepicker';

@Component({
  selector: 'app-list',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.scss'],
  providers: [DialogService]
})
export class DatesComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private departmentService: DepartmentsService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  // Departments List Array
  dates: Dates[];
  toDay = new Date();

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
    selectorHeight: '530px',
    height: '530px',
    width: '100%',
    selectorWidth: '100%',
    showSelectDateText: true
  };

  sdate: Date;
  edate: Date;

  onDateRangeChanged(event: IMyDateRangeModel) {
    this.sdate = event.beginJsDate;
    this.edate = event.endJsDate;
  }

  getCopyOfOptions(): IMyDrpOptions {
    return JSON.parse(JSON.stringify(this.myDateRangePickerOptionsInline));
  }
  //****************************************************** */


  dateRange = new FormControl('', [Validators.required]);

  datesForm: FormGroup = this.fb.group({
    dateRange: this.dateRange
  });

  onSubmit(): void {
    this.fetchReport();
  }

  ngOnInit() {
    this.fetchReport();
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
        this.toastr.error(data.message);
      } else {
        this.dates = data.data;
        let copy = this.getCopyOfOptions();
        let arr = [];
        data.data.forEach(element => {
          if (element.isEnabled) {
            let b = new Date(element.starteddate);
            let e = new Date(element.endeddate);
            arr.push({
              beginDate: {
                year: b.getFullYear(),
                month: b.getMonth() + 1,
                day: b.getDate()
              },
              endDate: {
                year: e.getFullYear(),
                month: e.getMonth() + 1,
                day: e.getDate()
              }
            });
          }
        });
        copy.disableDateRanges = arr;
        this.myDateRangePickerOptionsInline = copy;
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

  deleteDepartmentDate(_id, rowIndex: number) {
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: 'Tarih Silmeyi Onayla',
      message: 'Bu tarih aralığını başvuru formundan kaldırmak istiyor musun?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        let theForm = { _id: _id, starteddate: null, endeddate: null };
        this.departmentService.saveDepartmentDate(1, theForm).subscribe(date => {
          if (date.success === false) {
            this.toastr.error(date.message);
          } else {
            this.toastr.success(date.message);
            this.fetchReport();
          }
        })
      }
    });
    setTimeout(() => {
      disposable.unsubscribe();
    }, 15000);
  }
}