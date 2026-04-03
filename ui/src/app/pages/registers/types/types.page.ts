import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterWidgetService } from '@widgets/footer/footer.widget.service';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { I18N_KEYS } from '@i18n/language.types';
import { LanguageService } from '@i18n/language.service';
import { TypesPageService } from './types.page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'p-types',
  imports: [],
  templateUrl: './types.page.html',
  styleUrl: './types.page.scss',
})
export class TypesPage implements OnInit, OnDestroy {
  private readonly $subscriptions: Subscription[] = [];

  constructor(
    public readonly service: TypesPageService,
    public readonly i18n: LanguageService,
    public readonly header: HeaderWidgetService,
    public readonly footer: FooterWidgetService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.header.title.set(this.i18n.t(I18N_KEYS.REGISTERS.TYPES.TITLE));
    this.footer.enabledSearch.set(true);

    this.service.listAll();

    this.$subscriptions.push(
      this.footer.searchSubject.subscribe((search: string | null | undefined) => {
        console.log(search);
      }),
    );

    this.footer.setButtons([
      {
        id: 'new-type',
        type: 'button',
        variant: 'primary',
        label: this.i18n.t('registers.types.create'),
        click: () => console.log('create a new type'),
      },
    ]);
  }

  ngOnDestroy(): void {
    this.footer.reset();
    this.$subscriptions.forEach((s) => s.unsubscribe());
  }
}
