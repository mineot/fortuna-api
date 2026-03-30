import { Injectable } from '@angular/core';
import { MenuCheckbox, MenuConfiguration } from '@widgets/navbar/navbar.types';

@Injectable({ providedIn: 'root' })
export class AppMenuService {
  readonly menuItems: MenuConfiguration[] = [];

  constructor() {
    this.menuItems.push({
      id: 'menu-configuration',
      i18nLabel: 'Configuration',
      items: [
        {
          type: 'checkbox',
          id: 'menu-configuration-lang-en',
          i18nLabel: 'English',
          value: 'config-lang',
          checked: false,
          change: (event: Event, item: MenuCheckbox) => {
            item.checked = !item.checked;
            console.log(event, item);
          },
        },
        {
          type: 'checkbox',
          id: 'menu-configuration-lang-pt',
          i18nLabel: 'Portuguese',
          value: 'config-lang',
          checked: false,
          change: (event: Event, item: MenuCheckbox) => {
            item.checked = !item.checked;
            console.log(event, item);
          },
        },
      ],
    });
  }
}
