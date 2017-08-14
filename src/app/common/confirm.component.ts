import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
export interface ConfirmModel {
  title: string;
  message: string;
}
@Component({
  selector: 'confirm',
  template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <h4 class="modal-title">{{title}}</h4>
                     <button type="button" class="close" (click)="close()" >&times;</button>
                   </div>
                   <div class="modal-body">
                     <p>{{message}}</p>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-primary" (click)="confirm()">Tamam</button>
                     <button type="button" class="btn btn-secondary" (click)="close()">İptal</button>
                   </div>
                 </div>
                </div>`
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  confirm() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
}