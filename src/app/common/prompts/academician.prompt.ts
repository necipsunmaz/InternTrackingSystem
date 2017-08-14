import { Component, ViewChild, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { UserService } from '../../user/user.service';
import { DepartmentsService } from '../../departments/departments.service';
import { ToastrService } from '../../common/toastr.service';
import { IUser } from '../../user/user';


export interface PromptModel {
    title: string;
    academician_id: any;
}

@Component({
    selector: 'prompt',
    template: `<div *ngIf="academician != null" class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <h4 class="modal-title">{{title || 'Prompt'}}</h4>
                     <button type="button" class="close" (click)="close()">&times;</button>
                   </div>
                   <div class="modal-body">
                    <div class="card">
                        <div class="card-block">
                        <div class="row">
                            <div class="col">
                            <h4 class="ma-0"><span class="fw-400">{{academician.firstname}}</span> <b>{{academician.lastname}}</b></h4>
                            <small>{{academician.email}}</small>
                            <p class="mb-2">Kullanıcı Adı: {{academician.username}}</p>
                            <p class="mb-2">Departman: {{academician.department}}</p>
                            <a href="javascript:;" class="mt-1 d-block">{{academician.email}}</a>
                            <a href="javascript:;" class="mt-1 d-block">{{academician.phone}}</a>
                            </div>
                            <div class="col">
                            <figure>
                                <div class="avatar-status bg-red">
                                    <img src="assets/images/academician.png" style="width:150px;background: papayawhip;" alt="{{academician.firstname}} {{academician.lastname}} profil resmi" class="rounded-circle">
                                </div>
                            </figure>
                            </div>
                        </div>
                        </div>
                    </div>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-secondary" (click)="close()">Kapat</button>
                   </div>
                 </div>
                </div>`
})
export class PromptAcademician extends DialogComponent<PromptModel, string> implements PromptModel {
    title: string;
    academician_id: any;
    academician: IUser;
    percentage: number;


    constructor(dialogService: DialogService,
        private userService: UserService,
        private departmentService: DepartmentsService,
        private toastr: ToastrService) {
        super(dialogService);
    }


    ngOnInit() {
        this.academicianShow();
    }

    academicianShow() {
        this.userService.getAcademicianDetails(this.academician_id).subscribe(academician => {
            if (academician.success === false) {
                this.toastr.error(academician.message);
            } else {
                this.departmentService.getDepartmentName(academician.data.department).subscribe(dapartmentName => {
                    if (dapartmentName.success === false) {
                        this.toastr.error(dapartmentName.message)
                    } else {
                        academician.data.department = dapartmentName.data;
                        this.academician = academician.data;
                    }
                });
            }
        });
    }
}