import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmComponent } from '../../common/confirm.component';
import { ToastrService } from '../../common/toastr.service';
import { InternService } from '../intern.service';
import { IIntern } from '../intern';

@Component({
  selector: 'app-table-selection',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  providers: [DialogService]
})
export class TrackingComponent {
  constructor(private internService: InternService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private toastr: ToastrService) {
  }
  rowsInterns: any[] = [];
  selectedInterns: any[] = [];
  selectInt = { selected: [] };

  rowsDays = [];
  selectedDays: any[] = [];
  selectDay = { selected: [] };

  interns: IIntern[];
  days = [];

  amButton: boolean = false;
  pmButton: boolean = false;

  radioItems = ['Gün', 'Hafta', 'Ay', 'Dönem'];
  model = { options: 'Gün' };

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }


  onSelectIntern({ selected }) {
    this.selectInt.selected = selected;
    if (selected.length != 0) {
      let theForm = { time: this.toApisUnderstand(this.model.options), interns: [] };
      selected.forEach(element => {
        theForm.interns.push({ 'intern_id': element._id });
      });

      this.internService.postDaysByTime(theForm).subscribe(data => {
        if (data.success === false) {
          this.toastr.error(data.message);
        } else {
          this.rowsDays = data.data;
          this.days = data.data;
        }
      });
    } else {
      this.rowsDays = [];
    }
  }

  onSelectDays({ selected }) {
    this.selectDay.selected = selected;
    if (selected.length == 0) {
      this.selectedDays = [];
    }
  }

  toApisUnderstand(data: string): string {
    switch (data) {
      case 'Gün': return 'day';
      case 'Hafta': return 'week';
      case 'Ay': return 'month';
      case "Dönem": return 'period';
    }
  }

  listRefresh(options) {
    this.onSelectIntern(this.selectInt);
  }

  fetchInterns() {
    this.internService.getInternForTracking()//this.toApisUnderstand(this.model.options))
      .subscribe(data => {
        if (data.success === false) {
          this.toastr.error(data.message);
        } else {
          this.interns = data.data;
          this.rowsInterns = data.data;
        }
      });
  }

  ngOnInit() {
    this.fetchInterns();
  }

  saveDays() {
    if(this.selectDay.selected.length !== 0){
          let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: 'Yoklama Listesi Onayı',
      message: 'Seçtiğin tarihlerdeki yaptığın değişiklikleri kaydetmeyi onaylıyor musun?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        let theForm = { am:this.amButton, pm: this.pmButton, days: [] };
        this.selectDay.selected.forEach(element => {
          theForm.days.push({ '_id': element._id });
        });
        this.internService.postDaysForTracking(theForm).subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
            this.onSelectIntern(this.selectInt);
          }
        });
      }
    });
    } else {
      this.toastr.error('Lütfen tarih seçiniz!');
      this.selectDay.selected = [];
    }
  }

  updateFilterIntern(event) {
    const val = event.target.value;
    // filter our data
    this.rowsInterns = this.interns.filter(function (d) {
      return d.firstname.toLowerCase().indexOf(val) !== -1 || d.lastname.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
  }

  updateFilterDay(event) {
    const val = event.target.value;
    // filter our data
    this.rowsDays = this.days.filter(function (d) {
      return d.date.indexOf(val) !== -1 || !val;
    });
    // update the rows
  }
}
