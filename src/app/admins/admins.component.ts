import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { UserService } from '../user/user.service';
import { Admins } from './admins';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';


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
  selector: 'app-list',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  // Departments List Array
  admins: Admins[];

  // Phone Mask
  public myModel = '';
  public mask = ['+', '9', '0', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public _id = new FormControl('', [Validators.pattern('^[0-9a-fA-F]{24}$')]);
  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.email, Validators.required]);
  phone = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]);
  retypepass = new FormControl('', [Validators.required]);

  adminForm: FormGroup = this.fb.group({
    _id: this._id,
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    phone: this.phone,
    username: this.username,
    passwordGroup: this.fb.group({
      password: this.password,
      retypepass: this.retypepass,
    }, { validator: comparePassword })
  });

  ngOnInit() {
    this.fetchReport();
  }

  saveAdmin(formdata: any): void {
    if (this.adminForm.dirty && this.adminForm.valid) {
      let theForm = this.adminForm.value;
      if (theForm._id === null) theForm.password = this.adminForm.value.passwordGroup.password;
      delete theForm.passwordGroup;

      this.userService.registerAdmin(theForm)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
          }
          this.adminForm.reset();
          this.adminForm.controls['passwordGroup'].reset({ password: { value: '', disabled: false }, retypepass: { value: '', disabled: false } });
          this.fetchReport();
        });
    } else {
      this.adminForm.reset();
      this.toastr.error("Lütfen tüm bilgileri eksiksiz bir şekilde doldurun.");
    }
  }



  fetchReport() {
    this.userService.getUser(0).subscribe(data => {
      if (data.success === false) {
        if (data.errcode) {
          this.authService.logout();
          this.router.navigate(['login']);
        }
        this.toastr.error(data.message);
      } else {
        this.admins = data.data;
      }
    });
  }

  updateAdmin(admin) {
    this.adminForm.reset({
      _id: admin._id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      phone: admin.phone,
      email: admin.email,
      username: admin.username
    });
    this.adminForm.controls['passwordGroup'].reset({ password: { value: '********', disabled: true }, retypepass: { value: '********', disabled: true } });
  }

  resetForm() {
    this.adminForm.reset();
    this.adminForm.controls['passwordGroup'].reset({ password: { value: '', disabled: false }, retypepass: { value: '', disabled: false } });
  }

  deleteAdmin(_id, rowIndex: number) {
    this.userService.deleteUser(_id).subscribe(message => {
      if (message.success === false) {
        if (message.errcode) {
          this.authService.logout();
          this.router.navigate(['login']);
        }
        this.toastr.error(message.message);
      } else {
        this.toastr.success(message.message);
        this.admins.splice(rowIndex, 1);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
} 