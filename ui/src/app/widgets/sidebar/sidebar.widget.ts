import { Component } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import type { Language } from '@app/i18n';

@Component({
  selector: 'w-sidebar',
  imports: [],
  templateUrl: './sidebar.widget.html',
  styleUrl: './sidebar.widget.scss',
})
export class SidebarWidget {
  constructor(public readonly i18n: LanguageService) {}

  changeLanguage(language: Language) {
    this.i18n.setLanguage(language);
  }
}
