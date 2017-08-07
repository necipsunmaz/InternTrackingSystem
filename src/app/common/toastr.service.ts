import { Injectable } from '@angular/core'

declare let toastr: any

@Injectable()

export class ToastrService {
    success(message: string, title?: string) {
        toastr.success(message, title)
    }
    info(message: string, title?: string) {
        toastr.info(message, title)
    }
    warning(message: string, title?: string) {
        toastr.warning(message, title)
    }
    error(message: string, title?: string) {
        toastr.error(message, title)
    }
    confirm(message: string, title?: string): boolean {
        toastr.info(message + "<br /><br /><button type='button' onClick='func()' class='btn clear'>Evet</button>", title,
            {
                closeButton: true,
                allowHtml: true,
                timeOut: 0,
                extendedTimeOut: 0,
                tapToDismiss: true    
            }),
            function func(){return true}
            return;
            
    }

}

declare function confirm(message: string, title?: string): boolean;