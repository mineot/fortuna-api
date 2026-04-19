import type { Locale } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

export type AppLanguage = 'en-US' | 'pt-BR';
export type AppCurrency = 'USD' | 'BRL';

export type AppLocale = {
  language: AppLanguage;
  currency: AppCurrency;
  date: Locale;
};

export const SUPPORTED_LANGUAGES: AppLanguage[] = ['en-US', 'pt-BR'];
export const SUPPORTED_LOCALES: AppLocale[] = [
  { language: 'en-US', currency: 'USD', date: enUS },
  { language: 'pt-BR', currency: 'BRL', date: ptBR },
];
export const DEFAULT_LANGUAGE: AppLanguage = 'en-US';
export const LANGUAGE_STORAGE_KEY = 'fortuna.language';
