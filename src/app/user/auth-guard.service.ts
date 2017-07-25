import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';
import { ToastrService } from '../common/toastr.service';

@Injectable()
export  class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router,
                private toastr: ToastrService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLoggedIn(state.url);
    }

    checkLoggedIn(url: string): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        }

        this.toastr.info("Lütfen bu sayfadan giriş yapın.")
        this.router.navigate(['/user/signin']);
        return false;
    }
}