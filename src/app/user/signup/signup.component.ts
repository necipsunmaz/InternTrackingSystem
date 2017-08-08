import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { DatePickerService, I18n } from '../../common/datePicker.service'
import { NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '../../common/toastr.service'
import { UserService } from '../user.service';

function comparePassword(c: AbstractControl): { [key: string]: boolean } | null {
  let passwordControl = c.get('password');
  let confirmControl = c.get('retypepass');

  if (passwordControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (passwordControl.value === confirmControl.value) {
    return null;
  }
  return { 'mismatchedPassword': true };
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: DatePickerService }]
})
export class SignupComponent {


  constructor(private fb: FormBuilder,
    private userService: UserService,
    private datePickerService: DatePickerService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private router: Router,
    private _i18n: I18n,
    private toastr: ToastrService) {
  }

  // Gender Validation
  private departmentValue: String = null;
  departmentObj: Array<Object> = [
    { name: 'Bilgi İşlem' },
    { name: 'Kütüphane' },
    { name: 'Mühendislik' }
  ]

  // Dob Model Value
  private dobValue: NgbDateStruct;

  // Phone Mask
  public myModel = '';
  public mask = ['+', '9', '0', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.email, Validators.required]);
  department = new FormControl('', [Validators.required]);
  phone = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]);
  dob = new FormControl('', [Validators.required]);
  retypepass = new FormControl('', [Validators.required]);

  registerForm: FormGroup = this.fb.group({
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    department: this.department,
    phone: this.phone,
    username: this.username,
    dob: this.dob,
    passwordGroup: this.fb.group({
      password: this.password,
      retypepass: this.retypepass,
    }, { validator: comparePassword })
  });

  registerUser(formdata: any): void {
    if (this.registerForm.dirty && this.registerForm.valid) {
      let theForm = this.registerForm.value;
      theForm.dob = this.ngbDateParserFormatter.format(this.dobValue);
      theForm.department = this.departmentValue;
      theForm.password = this.registerForm.value.passwordGroup.password;
      delete theForm.passwordGroup;

      console.log(theForm);

      this.userService.register(theForm)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
            this.router.navigate(['/user/signin']);
          }
          this.registerForm.reset();
        });
    }
  }

}
