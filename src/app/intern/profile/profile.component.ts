import { Component } from '@angular/core';
import { AuthService } from '../../user/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../common/toastr.service';
import { InternService } from '../intern.service';
import { IIntern } from '../intern';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table-filter',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor() { }


  
  users;
}
