import { Injectable, signal } from '@angular/core';
import { Toast } from './toast.widget.types';

@Injectable({
  providedIn: 'root',
})
export class ToastWidgetService {
  private $timeout: number = 0;

  readonly showToast = signal<boolean>(false);

  readonly toast = signal<Toast>({
    variant: 'success',
    message: '',
  });

  show(toast: Toast) {
    this.hide();
    this.toast.set(toast);
    this.showToast.set(true);
    this.clock(toast);
  }

  hide() {
    this.showToast.set(false);
    clearTimeout(this.$timeout);
    this.toast.set({
      variant: 'success',
      message: '',
    });
  }

  private clock(toast: Toast) {
    switch (toast.variant) {
      case 'success':
        this.$timeout = setTimeout(() => this.hide(), 3000);
        break;
    }
  }
}
