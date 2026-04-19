import type { GetLocaleResponse, GetMetaResponse } from '@shared/handlers/app.types';

class AppService {
  getMeta(): Promise<GetMetaResponse> {
    return window.fortuna.appGetMeta() as Promise<GetMetaResponse>;
  }

  getLocale(): Promise<GetLocaleResponse> {
    return window.fortuna.appGetLocale() as Promise<string>;
  }
}

export const appService = new AppService();
