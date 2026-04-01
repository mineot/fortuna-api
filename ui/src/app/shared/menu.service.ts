import { Injectable } from '@angular/core';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';

@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly menuItems: MenuConfiguration[] = [];

  constructor() {
    this.menuItems.push({
      id: 'menu-configuration',
      i18nLabel: 'menu.configurations',
      items: [
        {
          type: 'link',
          id: 'menu-configuration-languages',
          i18nLabel: 'lenguages.title',
          href: '/languages',
        },
      ],
    });
  }
}
