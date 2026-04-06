import { ApiService } from '@shared/api.service';
import { Injectable, signal } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { ToastWidgetService } from '@widgets/toast/toast.widget.service';
import type { FilterTypes, NewType, Type, TypeUpdate } from '@shared/models/_types.model';

@Injectable({
  providedIn: 'root',
})
export class TypesPageService {
  readonly types = signal<Type[]>([]);

  constructor(
    private readonly api: ApiService,
    private readonly i18n: LanguageService,
    private readonly toast: ToastWidgetService,
  ) {}

  async listAll(params?: FilterTypes) {
    try {
      this.types.set(await this.api.types.listAll(params));
    } catch (err) {
      this.toastError('error_list_all', err);
    }
  }

  async create(type: NewType) {
    try {
      await this.api.types.create(type);
      await this.listAll();
    } catch (err) {
      this.toastError('error_create', err);
    }
  }

  async find(id: number): Promise<Type | undefined> {
    try {
      return await this.api.types.find(id);
    } catch (err) {
      this.toastError('error_get', err);
      return undefined;
    }
  }

  async update(type: TypeUpdate, id: number) {
    try {
      await this.api.types.update(type, id);
      await this.listAll();
    } catch (err) {
      this.toastError('error_update', err);
    }
  }

  async delete(id: number) {
    try {
      await this.api.types.delete(id);
      await this.listAll();
    } catch (err) {
      this.toastError('error_delete', err);
    }
  }

  private toastError(message: string, err: unknown) {
    this.toast.show({
      variant: 'error',
      message: this.i18n.t(`registers.types.${message}`),
      details: [(err as Error).message],
    });
  }
}
