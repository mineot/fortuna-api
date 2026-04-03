import type { RegisterTypes } from './models/types.model';

export type Api = {
  getSystemLanguage: () => Promise<string | null>;
  types: RegisterTypes;
};

export interface OnApi {
  getSystemLanguage: () => Promise<string | null>;
  types: RegisterTypes;
}
