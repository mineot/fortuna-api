import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import i18nManager from '@adonisjs/i18n/services/main';
import UserTransformer from '#transformers/user_transformer';
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware';

function pickUiMessages(messages: Record<string, string>) {
  return Object.fromEntries(Object.entries(messages).filter(([key]) => key.startsWith('app.')));
}

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  share(ctx: HttpContext) {
    const { session, auth } = ctx as Partial<HttpContext>;

    const error = session?.flashMessages.get('error') as string;
    const success = session?.flashMessages.get('success') as string;

    const i18n =
      'i18n' in ctx && ctx.i18n ? ctx.i18n : i18nManager.locale(i18nManager.defaultLocale);

    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      flash: ctx.inertia.always({
        error,
        success,
      }),
      locale: ctx.inertia.always(i18n.locale),
      messages: ctx.inertia.always(
        pickUiMessages(i18n.localeTranslations as Record<string, string>),
      ),
      user: ctx.inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
    };
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx);

    const output = await next();
    this.dispose(ctx);

    return output;
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>;
  export interface SharedProps extends MiddlewareSharedProps {}
}
