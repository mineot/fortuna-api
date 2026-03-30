import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '@i18n/language.service';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';

@Component({
  imports: [RouterLink],
  selector: 'w-navbar-menu',
  standalone: true,
  styleUrls: ['./menu.scss'],
  templateUrl: './menu.html',
})
export class Menu {
  @Input('menu-config') menuConfig: MenuConfiguration = {
    id: 'menu',
    i18nLabel: 'Menu',
    items: [],
  };

  constructor(public readonly i18n: LanguageService) {}
}
