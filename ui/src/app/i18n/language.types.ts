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

type KeysMap<T, Prefix extends string = ''> = {
  [K in keyof T & string as Uppercase<K>]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends object
      ? KeysMap<T[K], `${Prefix}${K}.`>
      : never;
};

export type TranslationKey = DotPath<typeof en>;

function createKeysMap<T extends Record<string, unknown>, P extends string = ''>(obj: T, prefix = '' as P): KeysMap<T, P> {
  const result = {} as KeysMap<T, P>;

  for (const key in obj) {
    const value = obj[key];
    const path = `${prefix}${key}`;
    const upperKey = key.toUpperCase() as Uppercase<typeof key>;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      (result as Record<string, unknown>)[upperKey] = createKeysMap(value as Record<string, unknown>, `${path}.`);
      continue;
    }

    (result as Record<string, unknown>)[upperKey] = path;
  }

  return result;
}

export const I18N_KEYS = createKeysMap(en);
