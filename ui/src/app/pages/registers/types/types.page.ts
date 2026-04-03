import { Component, OnInit } from '@angular/core';
import { TypesPageService } from './types.page.service';
import { LanguageService } from '@i18n/language.service';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { I18N_KEYS } from '@app/i18n/language.types';

@Component({
  selector: 'p-types',
  imports: [],
  templateUrl: './types.page.html',
  styleUrl: './types.page.scss',
})
export class TypesPage implements OnInit {
  constructor(
    public readonly service: TypesPageService,
    public readonly i18n: LanguageService,
    public readonly header: HeaderWidgetService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.header.title = this.i18n.t(I18N_KEYS.REGISTERS.TYPES.TITLE);
    this.service.listAll();
  }
}
