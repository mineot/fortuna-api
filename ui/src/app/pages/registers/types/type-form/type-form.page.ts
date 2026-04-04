import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterWidgetService } from '@widgets/footer/footer.widget.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { LanguageService } from '@i18n/language.service';
import { Router } from '@angular/router';
import { ToastWidgetService } from '@widgets/toast/toast.widget.service';
import { TypesPageService } from '../types.page.service';

@Component({
  selector: 'p-type-form',
  imports: [ReactiveFormsModule],
  templateUrl: './type-form.page.html',
  styleUrl: './type-form.page.scss',
})
export class TypeFormPage implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    group: new FormControl('', [Validators.required, Validators.min(1)]),
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    public readonly footer: FooterWidgetService,
    public readonly header: HeaderWidgetService,
    public readonly i18n: LanguageService,
    public readonly router: Router,
    public readonly service: TypesPageService,
    public readonly toast: ToastWidgetService,
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
          if (this.form.valid) {
            this.service.create(this.form.value).then(() => {
              this.toast.show({
                variant: 'success',
                message: this.i18n.t('registers.types.success_create'),
              });
              this.router.navigate(['/registers/types']);
            });
          } else {
            this.toast.show({
              variant: 'warning',
              message: this.i18n.t('common.invalid_form'),
            });
          }
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

  validate(field: 'group' | 'name', type: 'required' | 'min'): boolean | undefined {
    return this.form.get(field)?.hasError(type);
  }
}
