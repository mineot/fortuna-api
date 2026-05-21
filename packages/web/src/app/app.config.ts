import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { AuthSessionService } from './core/auth/auth-session.service.js';
import { authInterceptor } from './core/http/auth.interceptor.js';
import { httpErrorInterceptor } from './core/http/http-error.interceptor.js';
import { routes } from './app.routes.js';

const SUPPORTED_LANGS = ['pt-BR', 'en'] as const;
const FALLBACK_LANG = 'en';
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const normalizeSupportedLanguage = (language: string): SupportedLang => {
  const normalizedLanguage = language.toLowerCase();
  if (normalizedLanguage.startsWith('pt')) {
    return 'pt-BR';
  }
  return 'en';
};

const detectBrowserLanguage = (): SupportedLang => {
  const languages = globalThis.navigator?.languages ?? [];
  const preferredLanguage = languages.find((language) => language.length > 0);
  return normalizeSupportedLanguage(preferredLanguage ?? globalThis.navigator?.language ?? FALLBACK_LANG);
};

const initializeApp = async () => {
  const session = inject(AuthSessionService);
  const translate = inject(TranslateService);

  const activeLang = detectBrowserLanguage();

  translate.addLangs([...SUPPORTED_LANGS]);
  await firstValueFrom(translate.use(activeLang));
  globalThis.document?.documentElement.setAttribute('lang', activeLang);

  session.initializeFromStorage();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: FALLBACK_LANG,
    }),
    provideRouter(routes),
    provideAppInitializer(initializeApp),
  ],
};
