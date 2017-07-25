import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from '../../common/toastr.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

   constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) {
  }

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  form: FormGroup = this.fb.group({
    username: this.username,
    password: this.password,
  });


  loginUser(formdata:any): void {
    if (this.form.dirty && this.form.valid) {
      this.authService.login(this.form.value)
        .subscribe(data => {
          if (data.json().success === false) {
            this.toastr.error(data.json().message);
          } else {
            this.toastr.success('Hoşgeldin ' + data.json().message.firstname);
            this.router.navigate(['/dashboard']);
          }
          this.form.reset();
        });
    }
  }

}
