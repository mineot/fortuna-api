import { Api, OnApi, Types } from './api.types';
import { FilterTypes, NewType, TypeUpdate } from './models/_types.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnApi {
  private $api: Api;

  constructor() {
    if (!window.electronApi?.app) {
      throw new Error('Electron API is not available.');
    } else {
      this.$api = window.electronApi.app;
    }
  }

  async getSystemLanguage() {
    return this.$api.getSystemLanguage();
  }

  readonly types: Types = {
    listAll: (params?: FilterTypes) => this.$api.types.listAll(params),
    find: (id: number) => this.$api.types.find(id),
    create: (type: NewType) => this.$api.types.create(type),
    update: (type: TypeUpdate, id: number) => this.$api.types.update(type, id),
    delete: (id: number) => this.$api.types.delete(id),
  };
}
