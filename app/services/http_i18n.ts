import type { HttpContext } from '@adonisjs/core/http';

export function tHttp(i18n: HttpContext['i18n'], message: string) {
  if (!i18n) return message;
  const key = `domain.http.${message}`;
  const translated = i18n.t(key);
  return translated === key ? message : translated;
}
