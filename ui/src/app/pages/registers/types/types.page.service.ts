import { ApiService } from '@shared/api.service';
import { Injectable, signal } from '@angular/core';
import type { CreateType, ListAllTypes, Type, UpdateType } from '@shared/models/types.model';

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

  async create(type: CreateType) {
    await this.api.types.create(type);
    await this.listAll();
  }

  async update(type: UpdateType) {
    await this.api.types.update(type);
    await this.listAll();
  }

  async delete(id: number) {
    await this.api.types.delete(id);
    await this.listAll();
  }
}
