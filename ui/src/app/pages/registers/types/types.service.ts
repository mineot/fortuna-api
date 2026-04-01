import { Injectable, signal } from '@angular/core';
import { ApiService } from '@app/shared/api.service';
import { Type } from '@app/shared/api.types';

@Injectable({
  providedIn: 'root',
})
export class TypesService {
  readonly types = signal<Type[]>([]);

  constructor(private readonly api: ApiService) {}

  listAll() {
    this.api.types.listAll().then((list) => {
      this.types.set(list);
    });
  }
}
