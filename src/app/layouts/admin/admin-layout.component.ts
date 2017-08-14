import { Component, OnInit, OnDestroy, ViewChild, HostListener, AnimationTransitionEvent } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { DepartmentsService } from '../../departments/departments.service';
import { AuthService } from "../../user/auth.service";
import { ToastrService } from '../../common/toastr.service'
//import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';

export interface Options {
  heading?: string;
  removeFooter?: boolean;
  mapHeader?: boolean;
}

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

var MENUITEMS = [];


@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  providers:[DepartmentsService]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  private _router: Subscription;
  MenuHead : string;

  currentLang = 'en';
  options: Options;
  theme = 'light';
  showSettings = false;
  isDocked = false;
  isBoxed = false;
  isOpened = true;
  mode = 'push';
  _mode = this.mode;
  _autoCollapseWidth = 991;
  width = window.innerWidth;

  @ViewChild('sidebar') sidebar;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private departmentsService: DepartmentsService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private titleService: Title) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit(){
    let role = JSON.parse(localStorage.getItem('currentUser')).user.role;
    if (role != null) {
      if (role === 0) {
        this.MenuHead = 'Süper Admin'
        MENUITEMS = [];
        MENUITEMS.push(
          {
            state: 'dashboard',
            name: 'GİRİŞ',
            type: 'link',
            icon: 'basic-home'
          }, {
            state: 'admins',
            name: 'Yöneticiler',
            type: 'link',
            icon: 'basic-server'
          }, {
            state: 'departments',
            name: 'Departmanlar',
            type: 'link',
            icon: 'basic-server'
          }, {
            state: 'analyzes',
            name: 'ANALİZLER',
            type: 'link',
            icon: 'ecommerce-graph1'
          });
      } else if (role === 1) {
        this.departmentsService.getDepartmentName(JSON.parse(localStorage.getItem('currentUser')).user.department).subscribe(department => {
          if(department.success === false){
            this.toastr.error(department.message);
          } else {
            this.MenuHead = department.data;
            console.log(this.MenuHead);
          }
        })
        MENUITEMS = [];
        MENUITEMS.push(
          {
            state: 'dashboard',
            name: 'GİRİŞ',
            type: 'link',
            icon: 'basic-home'
          }, {
            state: 'appeals',
            name: 'BAŞVURULAR',
            type: 'sub',
            icon: 'basic-paperplane',
            children: [{
              state: 'intern',
              name: 'Stajyer Başvuruları'
            }, {
              state: 'academician',
              name: 'Akademisyen Başvuruları'
            }]
          }, {
            state: 'interns',
            name: 'STAJYER',
            type: 'sub',
            icon: 'basic-postcard',
            children: [{
              state: 'tracking',
              name: 'Devam/Devamsızlık'
            }, {
              state: 'profile',
              name: 'PROFİL'
            }, {
              state: 'calendar',
              name: 'Devam/Devamsızlık Takvimi'
            }]
          }, {
            state: 'dates',
            name: 'Tarihler',
            type: 'link',
            icon: 'basic-calendar'
          }, {
            state: 'analyzes',
            name: 'ANALİZLER',
            type: 'link',
            icon: 'ecommerce-graph1'
          });
      } else if (role === 2) {
        this.MenuHead = 'Akademisyen'
        MENUITEMS = [];
        MENUITEMS.push({
          state: 'dashboard',
          name: 'GİRİŞ',
          type: 'link',
          icon: 'basic-home'
        });
      } else {
        MENUITEMS = [];
      }
    }

    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    }

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      // Scroll to top on view load
      document.querySelector('.main-content').scrollTop = 0;

      if (this.isOver() || event.url === '/maps/fullscreen') {
        this.isOpened = false;
      }

      this.route.children.forEach((route: ActivatedRoute) => {
        let activeRoute: ActivatedRoute = route;
        while (activeRoute.firstChild) {
          activeRoute = activeRoute.firstChild;
        }
        this.options = activeRoute.snapshot.data;
      });

      if (this.options.hasOwnProperty('heading')) {
        this.setTitle(this.options.heading);
      }
    });
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle('ADÜ Staj Takip Sistemi | ' + newTitle);
  }

  toogleSidebar(): void {
    if (this._mode !== 'dock') {
      this.isOpened = !this.isOpened;
    }
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 991px)`).matches;
  }

  openSearch(search) {
    this.modalService.open(search, { windowClass: 'search', backdrop: false });
  }

  addMenuItem(): void {
    this.add({
      state: 'menu',
      name: 'MENU',
      type: 'sub',
      icon: 'basic-webpage-txt',
      children: [
        { state: 'menu', name: 'MENU' },
        { state: 'menu', name: 'MENU' }
      ]
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.width === event.target.innerWidth) { return false; }
    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    } else {
      this._mode = this.mode;
      this.isOpened = true;
    }
    this.width = event.target.innerWidth;
  }

  logoutfunc() {
    this.authService.logout();
    this.toastr.success('Başarıyla çıkış yaptınız.');
    this.router.navigate(['/user/signin']);
  }

  getAll(): Menu[] {
    return MENUITEMS;
  }

  add(menu: Menu) {
    MENUITEMS.push(menu);
  }
}
