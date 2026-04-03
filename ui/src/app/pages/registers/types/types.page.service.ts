import { ApiService } from '@shared/api.service';
import { Injectable, signal } from '@angular/core';
import { ListAllTypes, Type } from '@shared/api.types';

@Injectable({
  providedIn: 'root',
})
export class TypesPageService {
  readonly types = signal<Type[]>([]);

  constructor(private readonly api: ApiService) {}

  async listAll(params?: ListAllTypes) {
    const list = await this.api.types.listAll(params);
    this.types.set(list);
  }
}
