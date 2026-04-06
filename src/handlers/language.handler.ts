import { app } from 'electron';

export async function registerLanguageHandler(): Promise<string[]> {
  const preferred = app.getPreferredSystemLanguages();
  return preferred.length > 0 ? preferred : [app.getLocale()];
}
