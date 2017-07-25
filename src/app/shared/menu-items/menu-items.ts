import { Injectable } from '@angular/core';

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

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'GİRİŞ',
    type: 'link',
    icon: 'basic-accelerator'
  },{
    state: 'appeals',
    name: 'BAŞVURULAR',
    type: 'link',
    icon: 'basic-paperplane'
  }, {
    state: 'analyzes',
    name: 'ANALİZLER',
    type: 'link',
    icon: 'ecommerce-graph1'
  }, {
    state: 'intern',
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
  }
];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  add(menu: Menu) {
    MENUITEMS.push(menu);
  }
}
