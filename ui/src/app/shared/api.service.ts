import { Injectable } from '@angular/core';
import { Api, ListAllTypes, OnApi } from './api.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnApi {
  private readonly api: Api | undefined = window.electronApi?.app;

  getSystemLanguage(): Promise<string | null> {
    return this.api?.getSystemLanguage() ?? Promise.resolve(null);
  }

  readonly types = {
    listAll: (params?: ListAllTypes) => this.api?.types.listAll(params) ?? Promise.resolve([]),
  };
}
