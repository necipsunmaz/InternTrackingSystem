import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  page = 4;
  currentPage = 3;
  isDisabled = true;

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }
}
