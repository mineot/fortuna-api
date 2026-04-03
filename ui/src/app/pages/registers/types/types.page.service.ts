import { Injectable, signal } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Type } from '@shared/api.types';

@Injectable({
  providedIn: 'root',
})
export class TypesPageService {
  readonly types = signal<Type[]>([]);

  constructor(private readonly api: ApiService) {}

  listAll() {
    this.api.types.listAll().then((list) => {
      this.types.set(list);
    });
  }
}
