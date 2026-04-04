import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterWidgetService } from '@widgets/footer/footer.widget.service';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { LanguageService } from '@i18n/language.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'p-type-form',
  imports: [ReactiveFormsModule],
  templateUrl: './type-form.page.html',
  styleUrl: './type-form.page.scss',
})
export class TypeFormPage implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    group: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

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

  onSubmit() {}
}
