import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { ToastrService } from '../common/toastr.service'
import { InternService } from './intern.service';
import { DatePickerService, I18n } from '../DatePicker/DatePicker.service'

import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'intern-form',
  templateUrl: './intern-form.component.html',
  styleUrls: ['./intern-form.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: DatePickerService }]
})


export class InternFormComponent {

  constructor(private fb: FormBuilder,
    private internService: InternService,
    private datePickerService: DatePickerService,
    private router: Router,
    private _i18n: I18n,
    private toastr: ToastrService) {
  }


  // Image Converter Base64
  private base64textString: String = "";
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
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(btoa(binaryString));
  }


  // InternForm Validation

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
  photo = new FormControl('', [Validators.required]);

  genderValue: number;
  genders: Array<Object> = [
    { num: true, name: 'Erkek' },
    { num: false, name: 'Kadın' }
  ]

  toGender() {
    this.genderValue = +this.genderValue;
    console.log(this.genderValue);
  }

  internFormStep1: FormGroup = this.fb.group({
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    tc: this.tc,
    gender: this.genderValue,
    dob: this.dob,
    phone: this.phone,
    address: this.address,
    photo: this.base64textString
  });

  internFormStep2: FormGroup = this.fb.group({
    starteddate: this.starteddate,
    endeddate: this.endeddate
  })

  // Save Intern Form

  saveintern(formdata: any): void {
    if (this.internFormStep1.dirty && this.internFormStep1.valid) {
      let theForm = this.internFormStep1.value;

      this.internService.saveIntern(theForm)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
            this.router.navigate(['/user/signin']);
          }
          //this.internFormStep1.reset();
          //this.internFormStep2.reset();
        });
    }
  }

  step2: any = {
    showNext: true,
    showPrev: true
  };

  step3: any = {
    showSecret: false
  };

  data: any = {
    email: 'muk@gmail.com'
  };

  isCompleted: boolean = false;

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
    this.isCompleted = true;
    this.toastr.success("Staj formu gönderildi.");
    this.router.navigate(['/user/signin']);
  }

  onStepChanged(step) {
    console.log('Changed to ' + step.title);
  }
}