import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { InternService } from '../intern/intern.service';
import { IIntern } from '../intern/intern';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './appeals.component.html',
  styleUrls: ['./appeals.component.scss']
})
export class AppealsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private internService: InternService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  interns: IIntern[];
  userObj: any;
  exptotal: number;
  form = new FormGroup({});
  radioItems = [ 'onaylanmayan', 'onaylanan'];
  model = { options: 'onaylanmayan' };
  basildimi = false;

  button = this.radioItems[0];

  onSubmit(): void {
    console.log(this.model);
    this.fetchReport();
    this.basildimi = true;
  }

   checkVerify(veris: string): boolean {
    if (veris == "onaylanan") { return true } else { return false };
  }


  ngOnInit() {
    this.userObj = this.authService.currentUser;
    this.listRefresh();
  }

  /**
  checkVerify(veris: string): boolean {
    if (veris == "Onaylananlar") { return true } else { return false };
  }
  */
  
  listRefresh() {
    console.log(this.model);
    this.fetchReport();
    this.basildimi = true;
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

  verifyIntern(internid, state) {
    if (confirm('Stajyer onaylansınmı?')) {
      this.internService.verifyIntern(internid, state)
        .subscribe(data => {
          if (data.success === false) {
            if (data.errcode) {
              this.authService.logout();
              this.router.navigate(['login']);
            }
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
          }
        });
    }
  }

  deleteRow(rowNumber: number) {
    this.interns.splice(rowNumber, 1);
    this.changeDetectorRef.detectChanges();
  }
} 