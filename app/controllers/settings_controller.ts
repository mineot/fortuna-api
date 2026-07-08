import Setting from '#models/setting';
import SettingsTransformer from '#transformers/settings_transformer';
import { updateSettingValidator } from '#validators/setting';
import i18nManager from '@adonisjs/i18n/services/main';
import type { HttpContext } from '@adonisjs/core/http';

function pickUiMessages(messages: Record<string, string>) {
  return Object.fromEntries(Object.entries(messages).filter(([key]) => key.startsWith('app.')));
}

export default class SettingsController {
  async index({ auth, inertia }: HttpContext) {
    const settings = await Setting.query().where('user_id', auth.user!.id).firstOrFail();

    return inertia.render('settings', {
      settings: SettingsTransformer.transform(settings),
    });
  }

  async update({ auth, request, response }: HttpContext) {
    const settings = await Setting.query().where('user_id', auth.user!.id).firstOrFail();

    const payload = await request.validateUsing(updateSettingValidator);

    settings.merge({
      locale: payload.locale,
      currency: payload.currency,
      timezone: payload.timezone,
    });

    await settings.save();

    const newI18n = i18nManager.locale(payload.locale);

    return response.ok({
      data: {
        settings: SettingsTransformer.transform(settings),
        locale: payload.locale,
        messages: pickUiMessages(newI18n.localeTranslations as Record<string, string>),
      },
    });
  }
}
