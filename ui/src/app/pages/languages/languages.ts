import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { Language } from '@i18n/language.types';
import { PageService } from '@shared/page.service';
import { Page } from '@widgets/page/page';

@Component({
  selector: 'p-languages',
  imports: [Page],
  templateUrl: './languages.html',
  styleUrl: './languages.scss',
})
export class Languages implements OnInit {
  constructor(
    public readonly i18n: LanguageService,
    private readonly page: PageService,
  ) {}

  ngOnInit(): void {
    this.page.i18nTitle.set('lenguages.title');
  }

  isLanguage(language: Language): boolean {
    return this.i18n.getLanguage() === language;
  }

  onChange(language: Language) {
    this.i18n.setLanguage(language);
  }
}
