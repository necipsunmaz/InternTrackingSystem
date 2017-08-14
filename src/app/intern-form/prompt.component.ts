import { Component, ViewChild, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';


export interface PromptModel {
    title: string;
    question: string;
    img: any;
}

@Component({
    selector: 'prompt',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <h4 class="modal-title">{{title || 'Prompt'}}</h4>
                     <button type="button" class="close" (click)="close()">&times;</button>
                   </div>
                   <div class="modal-body">
                    <div role="alert" class="alert alert-info alert-dismissible">Lütfen resmini seni tanıyabileceğimiz bir şekilde kırp.</div>
                    <div>
                        <img-cropper #cropper [image]="data" [settings]="cropperSettings"></img-cropper>
                    </div>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-primary" (click)="apply()">Tamam</button>
                     <button type="button" class="btn btn-secondary" (click)="close()">İptal</button>
                   </div>
                 </div>
                </div>`
})
export class PromptComponent extends DialogComponent<PromptModel, string> implements PromptModel {
    title: string;
    question: string;
    img: any;

    data: any;
    private cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    constructor(dialogService: DialogService) {
        super(dialogService);

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 150;
        this.cropperSettings.height = 150;
        this.cropperSettings.croppedWidth = 150;
        this.cropperSettings.croppedHeight = 150;
        this.cropperSettings.minHeight = 150;
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.canvasWidth = 467;
        this.cropperSettings.canvasHeight = 350;
        this.cropperSettings.noFileInput = true;
        this.data = {};
    }


    ngOnInit() {
        this.fileChangeListener();
    }

    fileChangeListener() {
        var image: any = new Image();
        var file: File = this.img.target.files[0];
        var myReader: FileReader = new FileReader();
        var that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            //that.showConfirm(image);
            that.cropper.setImage(image);
            //that.confirmComponent.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    apply() {
        this.result = this.data.image;
        this.close();
    }
}