export const APP_CHANNELS = {
  getMeta: 'app:get-meta',
  getLocale: 'app:get-locale',
};

export type GetLocaleResponse = string;

export type GetMetaResponse = {
  name: string;
  version: string;
};
