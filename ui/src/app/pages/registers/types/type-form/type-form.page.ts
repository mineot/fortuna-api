import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterWidgetService } from '@widgets/footer/footer.widget.service';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { LanguageService } from '@i18n/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'p-type-form',
  imports: [],
  templateUrl: './type-form.page.html',
  styleUrl: './type-form.page.scss',
})
export class TypeFormPage implements OnInit, OnDestroy {
  constructor(
    public readonly footer: FooterWidgetService,
    public readonly header: HeaderWidgetService,
    public readonly i18n: LanguageService,
    public readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.header.title.set(this.i18n.t('registers.types.create'));

    this.footer.setButtons([
      {
        id: 'save',
        type: 'button',
        variant: 'success',
        label: this.i18n.t('common.save'),
        click: () => {
          console.log('Save Type');
        },
      },
      {
        id: 'cancel',
        type: 'button',
        variant: 'secondary',
        label: this.i18n.t('common.cancel'),
        click: () => this.router.navigate(['/registers/types']),
      },
    ]);
  }

  ngOnDestroy(): void {
    this.footer.reset();
  }
}
