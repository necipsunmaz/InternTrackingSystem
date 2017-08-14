import { Component, ViewChild, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { InternService } from '../../intern/intern.service';
import { DepartmentsService } from '../../departments/departments.service';
import { ToastrService } from '../../common/toastr.service';
import { IIntern } from '../../intern/intern';


export interface PromptModel {
    title: string;
    intern_id: any;
}

@Component({
    selector: 'prompt',
    template: `<div *ngIf="intern != null" class="modal-dialog">
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
                            <h4 class="ma-0"><span class="fw-400">{{intern.firstname}}</span> <b>{{intern.lastname}}</b></h4>
                            <small>{{intern.email}}</small>
                            <p class="mb-2">{{intern.dob | date:'dd MMMM yyyy'}}</p>
                            <p class="mb-2">Cinsiyet: {{intern.gender?'Erkek':'Kadın'}}</p>
                            <p class="mb-2">Akademisyen: {{intern.teacher}}</p>
                            <a href="javascript:;" class="mt-1 d-block">{{intern.email}}</a>
                            <a href="javascript:;" class="mt-1 d-block">{{intern.phone}}</a>
                            </div>
                            <div class="col">
                            <figure>
                                <div class="text-center">
                                <div class="avatar-status bg-red">
                                    <img src="{{intern.photo}}" alt="{{intern.firstname}} {{intern.lastname}} profil resmi" class="rounded-circle">
                                </div>
                                <div class="mt-1">Staj Durumu</div>
                                </div>
                                <div class="m-1">
                                    <ngb-progressbar type="success" [value]="percentage"></ngb-progressbar>
                                </div>
                            <div class="text-center"><small>%{{intern.tracking.percentage}} tamamladı</small></div>
                            </figure>
                            </div>
                        </div>
                        </div>
                        <div class="card-block text-center">
                        <p>Devam/Devamsızlık Gün Sayıları</p>
                        <div class="row">
                            <div class="col">
                            <h2 class="mt-0"><b>{{intern.tracking.total}}</b></h2>
                            <small>Toplam</small>
                            </div>
                            <div class="col">
                            <h2 class="mt-0"><b>{{intern.tracking.continuity}}</b></h2>
                            <small>Devam</small>
                            </div>
                            <div class="col">
                            <h2 class="mt-0"><b>{{intern.tracking.absenteeism}}</b></h2>
                            <small>Devamsızlık</small>
                            </div>
                            <div class="col">
                            <h2 class="mt-0"><b>{{intern.tracking.remaining}}</b></h2>
                            <small>Kalan</small>
                            </div>
                        </div>
                        </div>
                        <div class="card-block">
                        <p class="ff-headers text-uppercase mb-3"><strong>Hakkında</strong></p>
                        <p>{{intern.firstname}} {{intern.lastname}}, {{ intern.age }} yaşında , {{intern.address}} adresinde yaşamakta olup, 
                        {{ intern.department }} Departmanına {{intern.time}} gün süre ile staj yapma başvurusunda bulundu. Staj başvurusu {{intern.verified?"anaylandı":"onaylanmadı"}}.</p>
                        </div>
                    </div>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-secondary" (click)="close()">Kapat</button>
                   </div>
                 </div>
                </div>`
})
export class PromptIntern extends DialogComponent<PromptModel, string> implements PromptModel {
    title: string;
    intern_id: any;
    intern: IIntern;
    percentage: number;


    constructor(dialogService: DialogService,
        private internService: InternService,
        private departmentService: DepartmentsService,
        private toastr: ToastrService) {
        super(dialogService);
    }


    ngOnInit() {
        this.internShow();
    }

    internShow() {
        this.internService.getIntern(this.intern_id).subscribe(intern => {
            if (intern.success === false) {
                this.toastr.error(intern.message);
            } else {
                intern.data.age = this.calculateAge(intern.data.dob);
                intern.data.time = this.calculateTime(intern.data.starteddate, intern.data.endeddate);
                this.departmentService.getDepartmentName(intern.data.department).subscribe(dapartmentName => {
                    if (dapartmentName.success === false) {
                        this.toastr.error(dapartmentName.message)
                    } else {
                        intern.data.department = dapartmentName.data;

                        this.internService.getInternTracking(intern.data._id).subscribe(tracking => {
                            if (tracking.success === false) {
                                this.toastr.error(tracking.message);
                            } else {
                                this.percentage = tracking.data.percentage;
                                intern.data.tracking = tracking.data;
                                this.intern = intern.data;
                            }
                        });
                    }
                });
            }
        });
    }

    calculateAge(dob) {
        return new Date().getUTCFullYear() - new Date(dob).getUTCFullYear();
    }

    calculateTime(sdate, edate) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var firstDate = new Date(sdate);
        var secondDate = new Date(edate);
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    }
}