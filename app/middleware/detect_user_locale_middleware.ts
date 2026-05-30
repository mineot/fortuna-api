import Setting from '#models/setting';
import { I18n } from '@adonisjs/i18n';
import i18nManager from '@adonisjs/i18n/services/main';
import type { NextFn } from '@adonisjs/core/types/http';
import { type HttpContext, RequestValidator } from '@adonisjs/core/http';

/**
 * The "DetectUserLocaleMiddleware" middleware uses i18n service to share
 * a request specific i18n object with the HTTP Context
 */
export default class DetectUserLocaleMiddleware {
  /**
   * Using i18n for validation messages. Applicable to only
   * "request.validateUsing" method calls
   */
  static {
    RequestValidator.messagesProvider = (ctx) => {
      return ctx.i18n.createMessagesProvider();
    };
  }

  /**
   * This method reads the user language from the "Accept-Language"
   * header and returns the best matching locale by checking it
   * against the supported locales.
   *
   * Feel free to use different mechanism for finding user language.
   */
  protected getRequestLocale(ctx: HttpContext) {
    const userLanguages = ctx.request.languages();
    return i18nManager.getSupportedLocaleFor(userLanguages);
  }

  protected normalizeLocale(locale?: string | null) {
    if (!locale) return i18nManager.defaultLocale;
    return i18nManager.getSupportedLocaleFor([locale]) || i18nManager.defaultLocale;
  }

  async handle(ctx: HttpContext, next: NextFn) {
    let language = this.getRequestLocale(ctx) || i18nManager.defaultLocale;
    const authUser = ctx.auth.user;

    if (authUser) {
      const setting =
        (await Setting.query().where('user_id', authUser.id).first()) ||
        (await Setting.create({
          userId: authUser.id,
          currency: 'USD',
          locale: 'en-US',
          timezone: 'UTC',
          localeInitializedAt: null,
        }));

      if (!setting.localeInitializedAt) {
        const detected = this.normalizeLocale(language);
        await Setting.query()
          .where('id', setting.id)
          .whereNull('locale_initialized_at')
          .update({ locale: detected, locale_initialized_at: new Date() });
        language = detected;
      } else {
        language = this.normalizeLocale(setting.locale);
      }
    }

    /**
     * Assigning i18n property to the HTTP context
     */
    ctx.i18n = i18nManager.locale(this.normalizeLocale(language));

    /**
     * Binding I18n class to the request specific instance of it.
     * Doing so will allow IoC container to resolve an instance
     * of request specific i18n object when I18n class is
     * injected somewhere.
     */
    ctx.containerResolver.bindValue(I18n, ctx.i18n);

    /**
     * Sharing request specific instance of i18n with edge
     * templates.
     *
     * Remove the following block of code, if you are not using
     * edge templates.
     */
    if ('view' in ctx) {
      ctx.view.share({ i18n: ctx.i18n });
    }

    return next();
  }
}

/**
 * Notify TypeScript about i18n property
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    i18n: I18n;
  }
}
