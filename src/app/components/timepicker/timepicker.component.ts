import { Component } from '@angular/core';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent {
  meridian = true;
  time: NgbTimeStruct = {hour: 13, minute: 30, second: 30};
  seconds = true;
  spinners = true;
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;
  customTime;

  ctrl = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return {tooEarly: true};
    }
    if (value.hour > 13) {
      return {tooLate: true};
    }

    return null;
  });

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  toggleSeconds() {
    this.seconds = !this.seconds;
  }

  toggleSpinners() {
    this.spinners = !this.spinners;
  }
}
