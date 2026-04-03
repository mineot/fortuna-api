import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderWidgetService {
  private readonly $title = signal<string>('Header Title');

  get title(): string {
    return this.$title();
  }

  set title(value: string) {
    this.$title.set(value);
  }
}
