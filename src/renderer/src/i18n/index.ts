import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { enUS } from './resources/en-US';
import { ptBR } from './resources/pt-BR';
import {
  type AppLanguage,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from './types';

function normalizeLanguage(value: string | undefined | null): AppLanguage | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  if (normalized.startsWith('pt')) {
    return 'pt-BR';
  }

  if (normalized.startsWith('en')) {
    return 'en-US';
  }

  return null;
}

async function resolveInitialLanguage(): Promise<AppLanguage> {
  const stored = normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  if (stored) {
    return stored;
  }

  const systemLocale = normalizeLanguage(await window.fortuna.getLocale());
  if (systemLocale) {
    return systemLocale;
  }

  return DEFAULT_LANGUAGE;
}

export async function initializeI18n(): Promise<void> {
  const initialLanguage = await resolveInitialLanguage();

  await i18n.use(initReactI18next).init({
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      'en-US': {
        translation: enUS,
      },
      'pt-BR': {
        translation: ptBR,
      },
    },
  });

  localStorage.setItem(LANGUAGE_STORAGE_KEY, initialLanguage);
}

export async function changeLanguage(language: AppLanguage): Promise<void> {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
}

export { i18n };
