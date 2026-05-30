import app from '@adonisjs/core/services/app';
import { defineConfig, formatters, loaders } from '@adonisjs/i18n';

const i18nConfig = defineConfig({
  defaultLocale: 'en-US',
  supportedLocales: ['en-US', 'pt-BR'],
  fallbackLocales: {
    en: 'en-US',
    pt: 'pt-BR',
  },
  formatter: formatters.icu(),
  loaders: [
    loaders.fs({
      location: app.languageFilesPath(),
    }),
  ],
});

export default i18nConfig;
