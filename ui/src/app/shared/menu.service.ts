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
          type: 'checkbox',
          id: 'menu-configuration-lang-en',
          i18nLabel: 'menu.english',
          value: 'config-lang',
          checked: () => i18n.getLanguage() === 'en',
          change: () => i18n.setLanguage('en'),
        },
        {
          type: 'checkbox',
          id: 'menu-configuration-lang-pt',
          i18nLabel: 'menu.portuguese',
          value: 'config-lang',
          checked: () => i18n.getLanguage() === 'pt',
          change: () => i18n.setLanguage('pt'),
        },
      ],
    });
  }
}
