import TranslationTerm from '#models/translation_term';
import i18nManager from '@adonisjs/i18n/services/main';

export type ResolveTermInput = {
  namespace: string;
  termKey: string;
  locale: string;
  userId?: number | null;
};

export default class TranslationTermResolver {
  async resolve(input: ResolveTermInput) {
    const fallbackLocale = this.getFallbackLocale(input.locale);
    const locales =
      fallbackLocale === input.locale ? [input.locale] : [input.locale, fallbackLocale];

    for (const locale of locales) {
      const userValue = await this.findOne({ ...input, locale, userId: input.userId ?? null });
      if (userValue) return userValue;

      const globalValue = await this.findOne({ ...input, locale, userId: null });
      if (globalValue) return globalValue;
    }

    return `${input.namespace}.${input.termKey}`;
  }

  private getFallbackLocale(locale: string) {
    const resolved = i18nManager.getSupportedLocaleFor([locale]) || i18nManager.defaultLocale;
    return i18nManager.getFallbackLocaleFor(resolved);
  }

  private async findOne(input: ResolveTermInput) {
    const term = await TranslationTerm.query()
      .apply((scopes) => scopes.byNamespaceAndKey(input.namespace, input.termKey))
      .apply((scopes) => scopes.byLocale(input.locale))
      .apply((scopes) => scopes.byUser(input.userId ?? null))
      .first();

    return term?.value;
  }
}
