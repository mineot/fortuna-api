import Setting from '#models/setting';
import { updateSettingValidator } from '#validators/setting';
import type { HttpContext } from '@adonisjs/core/http';

export default class SettingsController {
  async index({ auth, inertia }: HttpContext) {
    const setting = await Setting.query().where('user_id', auth.user!.id).firstOrFail();

    return inertia.render('settings', {
      setting: setting.toJSON(),
    });
  }

  async update({ auth, request, response }: HttpContext) {
    const setting = await Setting.query().where('user_id', auth.user!.id).firstOrFail();

    const payload = await request.validateUsing(updateSettingValidator);

    setting.merge({
      locale: payload.locale,
      currency: payload.currency,
      timezone: payload.timezone,
    });

    await setting.save();

    return response.ok({ data: setting });
  }
}
