import { Component, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  t: any;
  greeting = {};
  name = 'World';

  @ViewChild('t') public tooltip: NgbTooltip;

  public changeGreeting(greeting: any): void {
    const isOpen = this.tooltip.isOpen();
    this.tooltip.close();
    if (greeting !== this.greeting || !isOpen) {
      this.greeting = greeting;
      this.tooltip.open(greeting);
    }
  }
}
