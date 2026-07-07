import Setting from '#models/setting';
import { updateSettingValidator } from '#validators/setting';
import type { HttpContext } from '@adonisjs/core/http';

export default class SettingsController {
  async index({ auth, inertia }: HttpContext) {
    const settings = await Setting.query().where('user_id', auth.user!.id).firstOrFail();

    return inertia.render('settings', {
      settings: settings.toJSON(),
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

    return response.ok({ data: settings });
  }
}
