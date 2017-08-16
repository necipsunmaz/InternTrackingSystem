import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { DatePickerService, I18n } from '../../common/datePicker.service'
import { NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '../../common/toastr.service'
import { UserService } from '../user.service';
import { InternService } from '../../intern/intern.service';
import { DepartmentsService } from '../../departments/departments.service';
import { Departments } from '../../departments/departments';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { IInterns } from './interns';



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
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: DatePickerService }, DepartmentsService, InternService]
})
export class SignupComponent implements OnInit {
  protected dataService: CompleterData;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private internService: InternService,
    private datePickerService: DatePickerService,
    private departmentsService: DepartmentsService,
    private completerService: CompleterService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private router: Router,
    private _i18n: I18n,
    private toastr: ToastrService) {
    this.dataService = completerService.local(this.internsData, 'name', 'name');
  }

  ngOnInit() {
    this.getDapartments();
  }

  // Intern Select
  selectedName = [];
  internsData: IInterns[] = [];

  selectIntern(intern: CompleterItem) {
    if (this.selectedName.find(x => x._id == intern.originalObject._id) == undefined) {
      this.selectedName.push({ name: intern.title, _id: intern.originalObject._id });
      this.registerForm.controls['interns'].setValue(true);
    } else {
      this.toastr.info("Bu stajyeri daha önce eklemişsiniz.");
    }
  }

  closeIntern(intern){
    console.log(intern);
    this.selectedName = this.selectedName.filter(x => x._id !== intern);
  }

  toInterns(id) {
    if (id != null) {
      this.userService.getInternsForAcademician(id).subscribe(data => {
        if (data.success === false) {
          this.toastr.error(data.message);
        } else {
          if (data.data[0] !== undefined) {
            data.data.forEach(element => {
                let intern = { _id: element._id, name: element.firstname + ' ' + element.lastname}
                this.internsData.push(intern);
            });
          } else {
            this.toastr.info('Departmana kayıtlı stajyer bulunamadı.');
          }
        }
      });
    } else {
      this.toastr.info('Lütfen önce departman seçin.');
    }
  }


  //Department Validation
  selectedDepartment: string = null;
  departments: Departments[];

  getDapartments() {
    //  if (this.internFormStep1.dirty && this.internFormStep1.valid) {
    this.departmentsService.getDepartmentsForAcademicianForm().subscribe(data => {
      if (data.success === false) {
        this.toastr.error(data.message);
      } else {
        if (data.data[0] !== undefined) {
          this.departments = data.data;
        } else {
          this.departments = [];
          this.selectedDepartment = null;
          this.toastr.info('Departman kayıtları henüz başlamamıştır. Lütfen sonra tekrar deneyiniz.');
        }

      }
    });
    // }
    // this.toastr.error('İlk aşamadaki gerekli tüm bilgileri doldurun!');
  }

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
  retypepass = new FormControl('', [Validators.required]);
  interns = new FormControl('', [Validators.required]);

  registerForm: FormGroup = this.fb.group({
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    department: this.department,
    phone: this.phone,
    username: this.username,
    interns: this.interns,
    passwordGroup: this.fb.group({
      password: this.password,
      retypepass: this.retypepass,
    }, { validator: comparePassword })
  });

  registerUser(formdata: any): void {
    if (this.registerForm.dirty && this.registerForm.valid && this.selectedName[0] != undefined) {
      let theForm = this.registerForm.value;
      theForm.dob = this.ngbDateParserFormatter.format(this.dobValue);
      theForm.department = this.selectedDepartment;
      theForm.password = this.registerForm.value.passwordGroup.password;
      delete theForm.interns;
      delete theForm.passwordGroup;

      this.userService.register(theForm)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
            let theInternForm = { academician: data.data};
            this.selectedName.forEach(element => {
              this.internService.putInternForAcademician(element._id, theInternForm).subscribe(intern => {
                if (intern.success === false) {
                  this.toastr.error(data.message);
                } else {
                  this.toastr.success(element.name + ' isimli öğrencinize başvuru yaptınız.');
                }
              });
            });

            //this.router.navigate(['/user/signin']);
          }
          this.registerForm.reset();
        });
    } else {
      this.toastr.error('Lütfen sizden istenen bilgileri eksiksiz doldurun!');
    }
  }

}
