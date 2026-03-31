import { Injectable } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';

@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly menuItems: MenuConfiguration[] = [];

  constructor(private readonly i18n: LanguageService) {
    this.menuItems.push({
      id: 'menu-configuration',
      i18nLabel: 'menu.configurations',
      items: [
        {
          type: 'link',
          id: 'menu-configuration-languages',
          i18nLabel: this.i18n.t('lenguages.title'),
          href: '/languages',
        },
      ],
    });
  }
}
