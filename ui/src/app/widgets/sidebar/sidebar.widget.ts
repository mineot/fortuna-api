import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarMenu } from './sidebar-menu/sidebar-menu.widget';
import type { Language } from '@i18n/language.types';
import type { Menu } from './sidebar-menu/sidebar-menu.widget';

@Component({
  selector: 'w-sidebar',
  imports: [SidebarMenu, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.widget.html',
  styleUrl: './sidebar.widget.scss',
})
export class SidebarWidget implements OnInit {
  public readonly menus: Menu[] = [];

  constructor(public readonly i18n: LanguageService) {}

  ngOnInit(): void {
    this.menus.push({
      id: 0,
      label: this.i18n.t('registers.title'),
      items: [
        {
          id: 0,
          routerLink: '/registers/types',
          label: this.i18n.t('registers.types.title'),
        },
      ],
    });
  }

  changeLanguage(language: Language) {
    this.i18n.setLanguage(language);
  }
}
