import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { ConfirmComponent } from '../common/confirm.component';
import { AuthService } from '../user/auth.service';
import { ToastrService } from '../common/toastr.service';
import { DepartmentsService } from './departments.service';
import { Departments } from './departments';

@Component({
  selector: 'app-list',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  providers: [DialogService]
})
export class DepartmentsComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private departmentService: DepartmentsService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  // Departments List Array
  departments: Departments[];

  // Admin SelectBox
  private adminValue: String = null;
  admins: Array<Object> = [];

  // Phone Mask
  public myModel = '';
  public mask = ['+', '9', '0', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  _id = new FormControl('', [Validators.pattern('^[0-9a-fA-F]{24}$')]);
  name = new FormControl('', [Validators.required]);
  admin = new FormControl('', [Validators.required, Validators.pattern('^[0-9a-fA-F]{24}$')]);
  email = new FormControl('', [Validators.email, Validators.required]);
  phone = new FormControl('', [Validators.required]);

  departmentForm: FormGroup = this.fb.group({
    _id: this._id,
    name: this.name,
    admin: this.admin,
    email: this.email,
    phone: this.phone
  });

  onSubmit(): void {
    this.fetchReport();
  }

  ngOnInit() {
    this.fetchReport();
  }

  saveIntern(formdata: any): void {
    if (this.departmentForm.dirty && this.departmentForm.valid) {
      let theForm = this.departmentForm.value;
      theForm.admin = this.adminValue;

      this.departmentService.saveDepartment(theForm)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
          }
          this.departmentForm.reset();
          this.fetchReport();
        });
    } else {
      this.departmentForm.reset();
      this.toastr.error("Lütfen tüm bilgileri eksiksiz bir şekilde doldurun.");
    }
  }



  fetchReport() {
    this.departmentService.getAllAdminUser(null).subscribe(data => {
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
    this.departmentService.getAllDepartments()
      .subscribe(data => {
        if (data.success === false) {
          if (data.errcode) {
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          data.data.forEach((element, index) => {
            this.departmentService.getAllAdminUser(element._id).subscribe(name => {
              if (name.success === false) {
                if (name.errcode) {
                  this.authService.logout();
                  this.router.navigate(['login']);
                }
                this.toastr.error(name.message);
              } else {
                element.username = name.data;
                this.departments = data.data;
              }
            });
          });
        }
      });
  }

  updateDepartment(department) {
    this.departmentForm.reset({
      _id: department._id,
      name: department.name,
      phone: department.phone,
      email: department.email,
      admin: department.admin
    });
  }

  deleteDepartment(_id, rowIndex: number) {
    this.dialogService.addDialog(ConfirmComponent, {
      title: 'Departman Silme Onayı',
      message: 'Departmanı silmen departmana ait tüm kayıtları silmene neden olur. Bu işlemi gerçekleştirmek istediğine emin misin?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.departmentService.deleteDepartment(_id).subscribe(message => {
          if (message.success === false) {
            if (message.errcode) {
              this.authService.logout();
              this.router.navigate(['login']);
            }
            this.toastr.error(message.message);
          } else {
            this.toastr.success(message.message);
            this.departments.splice(rowIndex, 1);
            this.changeDetectorRef.detectChanges();
          }
        });
      }
    });
  }
} 