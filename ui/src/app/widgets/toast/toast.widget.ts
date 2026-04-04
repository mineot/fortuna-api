import { Backgrounds, Icons, Texts } from './toast.widget.types';
import { Component } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { NgClass } from '@angular/common';
import { ToastWidgetService } from './toast.widget.service';

@Component({
  selector: 'w-toast',
  imports: [NgClass],
  templateUrl: './toast.widget.html',
  styleUrl: './toast.widget.scss',
})
export class ToastWidget {
  constructor(
    public readonly service: ToastWidgetService,
    public readonly i18n: LanguageService,
  ) {}

  title() {
    switch (this.service.toast().variant) {
      case 'success':
        return this.i18n.t('common.success');
      case 'warning':
        return this.i18n.t('common.warning');
      case 'info':
        return this.i18n.t('common.info');
      case 'error':
        return this.i18n.t('common.error');
    }
  }

  message() {
    return this.service.toast().message;
  }

  hasDetails(): boolean {
    const toast = this.service.toast();
    return toast?.details !== undefined && toast.details.length > 0;
  }

  details(): string {
    return this.service.toast().details?.join('\n') ?? '';
  }

  icon() {
    return {
      [Icons['success'] as string]: this.service.toast().variant === 'success',
      [Icons['warning'] as string]: this.service.toast().variant === 'warning',
      [Icons['info'] as string]: this.service.toast().variant === 'info',
      [Icons['error'] as string]: this.service.toast().variant === 'error',
    };
  }

  show() {
    return {
      show: this.service.showToast(),
      hide: !this.service.showToast(),
      [Backgrounds['success'] as string]: this.service.toast().variant === 'success',
      [Backgrounds['warning'] as string]: this.service.toast().variant === 'warning',
      [Backgrounds['info'] as string]: this.service.toast().variant === 'info',
      [Backgrounds['error'] as string]: this.service.toast().variant === 'error',
      [Texts['success'] as string]: this.service.toast().variant === 'success',
      [Texts['warning'] as string]: this.service.toast().variant === 'warning',
      [Texts['info'] as string]: this.service.toast().variant === 'info',
      [Texts['error'] as string]: this.service.toast().variant === 'error',
    };
  }

  hide() {
    this.service.hide();
  }
}
