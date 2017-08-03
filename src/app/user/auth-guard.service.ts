import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';
import { ToastrService } from '../common/toastr.service';


@Injectable()
export class IsLoggedIn {
    constructor(
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService) {
    }

    resolve(): void {
        if (this.authService.isLoggedIn()) {
            this.toastr.info("Önceden giriş yaptınız.");
            this.router.navigate(['/dashboard']);
        }
    }
}

@Injectable()
export class AuthGuard implements CanActivate {

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

        this.router.navigate(['/user/signin']);
        return false;
    }
}

@Injectable()
export class IsAdmin implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let role = JSON.parse(localStorage.getItem('currentUser')).user.role;
        if (role === 'Admin' || role === 'SuperAdmin') {
            return true
        }

    }
}

@Injectable()
export class IsSuperAdmin implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let role = JSON.parse(localStorage.getItem('currentUser')).user.role;
        return role === 'SuperAdmin'
    }
}

@Injectable()
export class IsAcedemician implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let role = JSON.parse(localStorage.getItem('currentUser')).user.role;
        return role === 'Acedemician'
    }
}