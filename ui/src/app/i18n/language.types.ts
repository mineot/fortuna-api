import { en } from './locales/en';

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends object ? DeepStringify<T[K]> : T[K];
};

export type TranslationSchema = DeepStringify<typeof en>;

export type Language = 'en' | 'pt';
