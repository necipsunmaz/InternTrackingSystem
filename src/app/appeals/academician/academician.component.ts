import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogService } from "ng2-bootstrap-modal";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ToastrService } from '../../common/toastr.service';
import { UserService } from '../../user/user.service';
import { PromptIntern } from '../../common/prompts/intern.prompt';
import { ConfirmComponent } from '../../common/confirm.component';
import { PromptAcademician } from '../../common/prompts/academician.prompt';
import { AuthService } from '../../user/auth.service';
import { InternService } from '../../intern/intern.service';
import { DepartmentsService } from '../../departments/departments.service';
import { IIntern } from '../../intern/intern';
import { IAcademician } from './academician';


@Component({
  selector: 'app-list',
  templateUrl: './academician.component.html',
  styleUrls: ['./academician.component.scss'],
  providers: [PromptIntern, DialogService, DepartmentsService]
})
export class AcademicianComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private internService: InternService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  interns: IIntern[];
  academicians: IAcademician[];

  radioItems = ['onaylanmayan', 'onaylanan'];
  model = { options: 'onaylanmayan' };

  checkVerify(veris: string): string {
    return veris == "onaylanmayan" ? "0" : "1";
  }

  showIntern(id) {
    this.dialogService.addDialog(PromptIntern, { title: 'Stajyer', intern_id: id });
  }

  showAcademician(id) {
    this.dialogService.addDialog(PromptAcademician, { title: 'Akademisyen', academician_id: id });
  }

  ngOnInit() {
    this.fetchReport();
  }


  fetchReport() {
    this.userService.getAcademicianByAdmin(this.checkVerify(this.model.options))
      .subscribe(data => {
        if (data.success === false) {
          if (data.errcode) {
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          this.academicians = data.data;
          var a = [];
          data.data.forEach(element => {
            this.internService.getInternForAdmin(element._id).subscribe(intern => {
              if (intern.success === false) {
                if (intern.errcode) {
                  this.authService.logout();
                  this.router.navigate(['login']);
                }
                this.toastr.error(intern.message);
              } else {
                element.intern = intern.data;
                a.push(element);
              }
            })
          });
          this.academicians = a;
        }
      });
  }

  verifyAcademician(status, academicianid, rowIndex: number) {
    if (status) {
      let disposable = this.dialogService.addDialog(ConfirmComponent, {
        title: 'Akademiyen Onayla',
        message: 'Akademisyeni onayladığın takdirde giriş yapabilecek ve stajyerlerine erişebilecek.'
      }).subscribe((isConfirmed) => {
        if (isConfirmed) {
          let theForm = { academician_id: academicianid };
          console.log(theForm);
          console.log(status);
          this.userService.academicianVerify(status, theForm)
            .subscribe(data => {
              if (data.success === false) {
                if (data.errcode) {
                  this.toastr.error(data.errcode);
                }
                this.toastr.error(data.message);
              } else {
                this.academicians.splice(rowIndex, 1);
                this.changeDetectorRef.detectChanges();
                this.toastr.success(data.message);
              }
            });
        }
      });
    } else {
      let disposable = this.dialogService.addDialog(ConfirmComponent, {
        title: 'Akademisyen Başvuru Kaldır',
        message: 'Akademisyen başvurusunu kaldırman tüm başvuruyu ve akademisyeni silecek! Bunu gerçekten yapmak istediğine emin misi?'
      }).subscribe((isConfirmed) => {
        if (isConfirmed) {
          let theForm = { academician_id: academicianid };
          console.log(theForm);
          console.log(status);
          this.userService.academicianVerify(status, theForm)
            .subscribe(data => {
              if (data.success === false) {
                if (data.errcode) {
                  this.toastr.error(data.errcode);
                }
                this.toastr.error(data.message);
              } else {
                this.academicians.splice(rowIndex, 1);
                this.changeDetectorRef.detectChanges();
                this.toastr.success(data.message);
              }
            });
        }
      });
    }
  }
}