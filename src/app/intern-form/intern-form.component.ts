import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { ToastrService } from '../common/toastr.service'
import { DepartmentsService } from '../departments/departments.service';
import { Departments } from '../departments/departments';
import { PromptComponent } from './prompt.component'
import { DatePickerService, I18n } from '../common/datePicker.service'
import { NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from "ng2-bootstrap-modal";
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { IMyDrpOptions, IMyDateRangeModel, IMyDefaultMonth, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';


@Component({
  selector: 'app-signup',
  templateUrl: './intern-form.component.html',
  styleUrls: ['./intern-form.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: DatePickerService }, PromptComponent, DialogService]
})
export class InternFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private departmentsService: DepartmentsService,
    private datePickerService: DatePickerService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private promptComponent: PromptComponent,
    private dialogService: DialogService,
    private router: Router,
    private _i18n: I18n,
    private toastr: ToastrService) { }

  ngOnInit() {

  }

  // Image Cropper and Converter Base64 
  public base64textString: String;
  showCropper($event) {
    let disposable = this.dialogService.addDialog(PromptComponent, {
      title: 'Profil Resmi',
      img: $event
    }).subscribe((data) => {
      if (data) {
        $event.target.value = null;
        this.base64textString = data;
        this.internFormStep1.controls['photo'].setValue(true);
      }
      $event.target.value = null;
    });
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
  departments: Departments[];

  getDapartments() {
    //  if (this.internFormStep1.dirty && this.internFormStep1.valid) {
    this.departmentsService.getDepartmentsForForm().subscribe(data => {
      if (data.success === false) {
        this.toastr.error(data.message);
      } else {
        if(data.data[0] !== undefined){
          this.departments = data.data;
        }else{
          this.departments = [];
          this.selectedDepartment = null;
          this.toDefaultTime(this.selectedDepartment);
          this.toastr.info('Departman kayıtları henüz başlamamıştır. Lütfen sonra tekrar deneyiniz.');
        }
        
      }
    });
    // }
    // this.toastr.error('İlk aşamadaki gerekli tüm bilgileri doldurun!');
  }

  selectedDepartment: string  = null;

  toDefaultTime(selected) {
    let copy = this.getCopyOfOptions();
    if (this.departments !== undefined && this.departments.length > 0) {
      let arr = [];
      this.departments.find(x => x._id == this.selectedDepartment).dates.forEach(element => {
          arr.push(element.starteddate);
          arr.push(element.endeddate);
      });
      let b = new Date(arr.sort().shift());
      let e = new Date(arr.sort().pop());
      b.setDate(b.getDate() - 1);
      e.setDate(e.getDate() + 1);

      copy.disableUntil = selected ? {
        year: b.getFullYear(),
        month: b.getMonth()+1,
        day: b.getDate()
      } : { year: 0, month: 0, day: 0 };

      copy.disableSince = selected ? {
        year: e.getFullYear(),
        month: e.getMonth()+1,
        day: e.getDate()
      } : { year: 0, month: 0, day: 0 };
      this.myDateRangePickerOptionsInline = copy;

      var dt = [];
      let x = 0;
      for (var i = 0; i < arr.length / 2; i++) {
        dt[i] = [];
        for (var a = 0; a < 2; a++) {
          dt[i][a] = arr.sort()[x];
          x++
        }
      }

      let disableDateRanges = [];

      dt.forEach(element => {
        let b = new Date(element[0]);
        let e = new Date(element[1]);
        e.setDate(e.getDate() - 1);
        b.setDate(b.getDate() + 1);

        disableDateRanges.push({
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
      });

      copy.disableDateRanges = disableDateRanges;
      this.myDateRangePickerOptionsInline = copy;
    } else {
      copy.disableUntil = selected ? { year: 0, month: 0, day: 0 } : { year: 2017, month: 8, day: 10 };
      copy.disableSince = selected ? { year: 0, month: 0,  day: 0 } : { year: 2017, month: 8, day: 10 };
      this.myDateRangePickerOptionsInline = copy;
    }
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
    this.edate = event.endJsDate
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
      theForm.department = this.selectedDepartment;
      theForm.dob = this.ngbDateParserFormatter.format(this.dobValue);
      theForm.starteddate = this.internFormStep2.value.starteddate;
      theForm.endeddate = this.internFormStep2.value.endeddate;


      this.departmentsService.saveIntern(theForm)
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
      this.toastr.error("Lütfen tüm bilgileri eksiksiz bir şekilde doldurun.");
    }
  }

  onStep1Next(event) {
    console.log('İlk Aşama Geçildi');
    this.getDapartments();
    this.toDefaultTime(this.selectedDepartment);
  }

  onStep2Next(event) {
    console.log('ikinci Aşama Geçildi');
  }

  onStep3Next(event) {
    console.log('Üçüncü Aşama Geçildi');
  }

  onComplete(event) {
    console.log('Tüm aşamalar tamamlandı');
    // this.isCompleted = true;
    //this.toastr.success("Staj formu gönderildi.");
    //this.router.navigate(['/user/signin']);
  }

  onStepChanged(step) {
    console.log('Bu aşama değiştirildi: ' + step.title);
  }
}