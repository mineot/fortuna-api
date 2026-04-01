import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  public readonly i18nTitle = signal<string>('common.title');
}
