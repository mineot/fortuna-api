import { Component, OnInit } from '@angular/core';
import { I18N_KEYS } from '@i18n/language.types';
import { LanguageService } from '@i18n/language.service';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';

@Component({
  selector: 'p-home',
  imports: [],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  constructor(
    public readonly header: HeaderWidgetService,
    public readonly i18n: LanguageService,
  ) {}

  ngOnInit(): void {
    this.header.title.set(this.i18n.t(I18N_KEYS.HOME.TITLE));
  }
}
