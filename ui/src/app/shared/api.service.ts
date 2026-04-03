import { Injectable } from '@angular/core';
import { Api, OnApi } from './api.types';
import { CreateType, ListAllTypes, UpdateType } from './models/types.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnApi {
  private readonly api: Api | undefined = window.electronApi?.app;

  getSystemLanguage(): Promise<string | null> {
    return this.api?.getSystemLanguage() ?? Promise.resolve(null);
  }

  readonly types = {
    listAll: (params?: ListAllTypes) => {
      return this.api?.types.listAll(params) ?? Promise.resolve([]);
    },
    create: (type: CreateType) => {
      return this.api?.types.create(type) ?? Promise.resolve([]);
    },
    update: (type: UpdateType) => {
      return this.api?.types.update(type) ?? Promise.resolve([]);
    },
    delete: (id: number) => {
      return this.api?.types.delete(id) ?? Promise.resolve([]);
    },
  };
}
