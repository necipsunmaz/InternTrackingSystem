import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PromptIntern } from '../../common/prompts/intern.prompt';
import { AuthService } from '../../user/auth.service';
import { ToastrService } from '../../common/toastr.service';
import { InternService } from '../intern.service';
import { IIntern } from '../intern';

@Component({
  selector: 'app-table-filter',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DialogService]
})
export class ProfileComponent {

  constructor(private authService: AuthService,
    private internService: InternService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) { }

  interns: IIntern[];
  rows = [];

  checkVerify(veris: string): boolean {
    if (veris == "onaylanan") { return true } else { return false };
  }

  showIntern(id) {
    this.dialogService.addDialog(PromptIntern, { title: 'Stajyer', intern_id: id });
  }

  ngOnInit() {
    this.fetchReport();
  }

  updateFilter(event) {
    const val = event.target.value;
    // filter our data
    const temp = this.interns.filter(function (d) {
      return d.lastname.toLowerCase().indexOf(val) !== -1 || d.firstname.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
  }

  fetchReport() {
    this.internService.getInternsForDepartment()
      .subscribe(data => {
        if (data.success === false) {
          if (data.errcode) {
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          this.interns = data.data;
          this.rows = data.data;
        }
      });
  }
}
