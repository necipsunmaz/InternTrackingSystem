import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogService } from "ng2-bootstrap-modal";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../user/auth.service';
import { ToastrService } from '../../common/toastr.service';
import { InternService } from '../../intern/intern.service';
import { PromptIntern } from '../../common/prompts/intern.prompt';
import { IIntern } from '../../intern/intern';
import { DepartmentsService } from '../../departments/departments.service';
import { ConfirmComponent } from '../../common/confirm.component';

@Component({
  selector: 'app-list',
  templateUrl: './intern.component.html',
  styleUrls: ['./intern.component.scss'],
  providers: [DialogService]
})
export class InternComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private internService: InternService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  interns: IIntern[];
  form = new FormGroup({});
  radioItems = ['onaylanmayan', 'onaylanan'];
  model = { options: 'onaylanmayan' };
  button = this.radioItems[0];

  onSubmit(): void {
    console.log(this.model);
    this.fetchReport();
  }

  checkVerify(veris: string): boolean {
    if (veris == "onaylanan") { return true } else { return false };
  }

  showIntern(id) {
    this.dialogService.addDialog(PromptIntern, { title: 'Stajyer', intern_id: id });
  }

  ngOnInit() {
    this.fetchReport();
  }

  fetchReport() {
    this.internService.getInternByVerify(this.checkVerify(this.model.options))
      .subscribe(data => {
        if (data.success === false) {
          if (data.errcode) {
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          this.interns = data.data;
        }
      });
  }

  verifyIntern(internid, state, rowIndex: number) {
    if (state) {
     this.dialogService.addDialog(ConfirmComponent, {
        title: 'Stajyer Onayla',
        message: 'Stajyeri onayladığında stajyere ait tarih aralığındaki tüm günler Devam/Devamsızlık takviminde etkinleşecektir.'
      }).subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.internService.verifyIntern(internid, state)
            .subscribe(data => {
              if (data.success === false) {
                if (data.errcode) {
                  this.authService.logout();
                  this.router.navigate(['login']);
                }
                this.toastr.error(data.message);
              } else {
                this.interns.splice(rowIndex, 1);
                this.changeDetectorRef.detectChanges();
                this.toastr.success(data.message);
              }
            });
        }
      });
    } else {
     this.dialogService.addDialog(ConfirmComponent, {
        title: 'Stajyer Onayı Kaldır',
        message: 'Stajyer onayını kaldırdığın takdirde şu ana kadar kaydedilmiş tüm Devam/Devamsızlık bilgileri takvimden kaldırılacaktır! Bu değişiklik geri alınamaz.'
      }).subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.internService.verifyIntern(internid, state)
            .subscribe(data => {
              if (data.success === false) {
                if (data.errcode) {
                  this.authService.logout();
                  this.router.navigate(['login']);
                }
                this.toastr.error(data.message);
              } else {
                this.interns.splice(rowIndex, 1);
                this.changeDetectorRef.detectChanges();
                this.toastr.success(data.message);
              }
            });
        }
      });
    }
  }
} 