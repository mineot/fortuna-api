import { en } from './locales/en';
import { pt } from './locales/pt';
import type { Language, TranslationSchema } from './language.types';

export const translations: Record<Language, TranslationSchema> = {
  en,
  pt,
};

export type { Language, TranslationSchema };
