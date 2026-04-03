import { app } from 'electron';

export function registerLanguageHandler() {
  const preferred = app.getPreferredSystemLanguages();

  if (preferred.length > 0) {
    return preferred;
  }

  return [app.getLocale()];
}
