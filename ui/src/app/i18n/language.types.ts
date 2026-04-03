import { en } from './locales/en';

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends object ? DeepStringify<T[K]> : T[K];
};

export type TranslationSchema = DeepStringify<typeof en>;

export type Language = 'en' | 'pt';

type DotPath<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends object
      ? DotPath<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

export type TranslationKey = DotPath<typeof en>;
