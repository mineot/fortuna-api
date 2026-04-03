import { Component, OnInit } from '@angular/core';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { LanguageService } from '@i18n/language.service';
import { I18N_KEYS, Language } from '@i18n/language.types';

@Component({
  selector: 'p-languages',
  imports: [],
  templateUrl: './languages.page.html',
  styleUrl: './languages.page.scss',
})
export class LanguagesPage implements OnInit {
  constructor(
    private readonly header: HeaderWidgetService,
    public readonly i18n: LanguageService,
  ) {}

  ngOnInit(): void {
    this.header.title = this.i18n.t(I18N_KEYS.CONFIGS.LANGUAGES.TITLE);
  }

  isLanguage(language: Language): boolean {
    return this.i18n.getLanguage() === language;
  }

  onChange(language: Language) {
    this.i18n.setLanguage(language);
  }
}
