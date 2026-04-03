import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

type ButtonDetail = {
  key: string;
  value: unknown;
};

type Button = {
  id: string;
  type: 'button';
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger';
  label: string;
  details?: ButtonDetail[];
  click: (event: Event, details?: ButtonDetail[]) => void;
};

@Injectable({
  providedIn: 'root',
})
export class FooterWidgetService {
  private readonly $items: Button[] = [];

  public readonly enabledSearch = signal<boolean>(false);
  public readonly resetSubject = new Subject();
  public readonly searchSubject = new Subject<string | null | undefined>();

  get items() {
    return this.$items;
  }

  setButtons(btn: Button[]) {
    this.$items.push(...btn);
  }

  reset() {
    this.$items.length = 0;
    this.enabledSearch.set(false);
    this.resetSubject.next(null);
  }
}
