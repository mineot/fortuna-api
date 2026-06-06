import type { HttpContext } from '@adonisjs/core/http';
import i18nManager from '@adonisjs/i18n/services/main';

export function tHttp(i18n: HttpContext['i18n'], messageKey: string) {
  const translator = i18n || i18nManager.locale(i18nManager.defaultLocale);
  const key = `domain.http.${messageKey}`;
  const translated = translator.t(key);
  return translated === key ? messageKey : translated;
}
