import { ApiMessageBody } from '@shared/api-message';
import { ApiService } from '@shared/api.service';
import { Injectable, signal } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { ToastWidgetService } from '@widgets/toast/toast.widget.service';
import type { FilterTypes, NewType, TypeSelect, TypeUpdate } from '@shared/models/types.model';

@Injectable({
  providedIn: 'root',
})
export class TypesPageService {
  readonly types = signal<TypeSelect[]>([]);

  constructor(
    private readonly api: ApiService,
    private readonly toast: ToastWidgetService,
    private readonly i18n: LanguageService,
  ) {}

  async listAll(params?: FilterTypes) {
    try {
      const list: ApiMessageBody<TypeSelect[]> = await this.api.types.listAll(params);
      this.types.set(list.data ?? []);
    } catch (err) {
      this.toastError('types_error_list_all', err as Error);
    }
  }

  async create(type: NewType) {
    try {
      await this.api.types.create(type);
      await this.listAll();
    } catch (err) {
      this.toastError('types_error_create', err as Error);
    }
  }

  async update(type: TypeUpdate, id: number) {
    try {
      await this.api.types.update(type, id);
      await this.listAll();
    } catch (err) {
      this.toastError('types_error_update', err as Error);
    }
  }

  async delete(id: number) {
    try {
      await this.api.types.delete(id);
      await this.listAll();
    } catch (err) {
      this.toastError('types_error_delete', err as Error);
    }
  }

  private toastError(message: string, err: Error) {
    this.toast.show({
      variant: 'error',
      message: this.i18n.t(`messages.${message}`),
      details: [err.message],
    });
  }
}
