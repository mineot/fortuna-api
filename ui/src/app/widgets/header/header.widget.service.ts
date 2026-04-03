import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderWidgetService {
  public readonly title = signal<string>('Header Title');
}
