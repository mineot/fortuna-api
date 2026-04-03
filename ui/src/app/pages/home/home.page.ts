import { Component, OnInit } from '@angular/core';
import { I18N_KEYS } from '@app/i18n/language.types';
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
    private readonly $header: HeaderWidgetService,
    private readonly $i18n: LanguageService,
  ) {}

  ngOnInit(): void {
    this.$header.title = this.$i18n.t(I18N_KEYS.HOME.TITLE);
  }
}
