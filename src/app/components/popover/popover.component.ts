import { Component, ViewChild } from '@angular/core';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {
  p: any;
  greeting = {};
  name = 'World';

  @ViewChild('p') public popover: NgbPopover;

  public changeGreeting(greeting: any): void {
    const isOpen = this.popover.isOpen();
    this.popover.close();
    if (greeting !== this.greeting || !isOpen) {
      this.greeting = greeting;
      this.popover.open(greeting);
    }
  }
}
