import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterWidgetService } from '@widgets/footer/footer.widget.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { LanguageService } from '@i18n/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastWidgetService } from '@widgets/toast/toast.widget.service';
import { TypesPageService } from '../types.page.service';
import { Type } from '@shared/models/_types.model';

@Component({
  selector: 'p-type-form',
  imports: [ReactiveFormsModule],
  templateUrl: './type-form.page.html',
  styleUrl: './type-form.page.scss',
})
export class TypeFormPage implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
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
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.header.title.set(this.i18n.t('registers.types.create'));

    const path = this.route.snapshot.routeConfig?.path;
    if (path === 'registers/types/:id/edit') {
      this.form.get('id')?.setValue(this.route.snapshot.paramMap.get('id'));
      this.service.find(Number(this.form.get('id')?.value)).then((type: Type | undefined) => {
        this.form.get('group')?.setValue(type?.group);
        this.form.get('name')?.setValue(type?.name);
      });
    }

    this.footer.setButtons([
      {
        id: 'save',
        type: 'button',
        variant: 'success',
        label: this.i18n.t('common.save'),
        click: () => {
          if (this.form.valid) {
            if (this.form.get('id')?.value) {
              this.service.update(this.form.value, this.form.get('id')?.value).then(() => {
                this.showToast('success', 'registers.types.success_update');
                this.router.navigate(['/registers/types']);
              });
            } else {
              this.service.create(this.form.value).then(() => {
                this.showToast('success', 'registers.types.success_create');
                this.router.navigate(['/registers/types']);
              });
            }
          } else {
            this.showToast('warning', 'common.invalid_form');
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

  private showToast(variant: 'warning' | 'success', message: string) {
    this.toast.show({
      variant,
      message: this.i18n.t(message),
    });
  }
}
