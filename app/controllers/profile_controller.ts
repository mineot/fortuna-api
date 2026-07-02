import { tHttp } from '#services/http_i18n';
import { updateProfileValidator } from '#validators/profile';
import hash from '@adonisjs/core/services/hash';
import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';

export default class UserProfileController {
  async index({ auth, inertia }: HttpContext) {
    const user = await User.query().where('id', auth.user!.id).firstOrFail();

    return inertia.render('profile', {
      user: user.toJSON(),
    });
  }

  async update({ auth, i18n, request, response }: HttpContext) {
    const user = await User.query().where('id', auth.user!.id).firstOrFail();
    const payload = await request.validateUsing(updateProfileValidator(auth.user!.id));

    user.fullName = payload.fullName;
    user.email = payload.email;

    if (payload.newPassword) {
      if (!payload.currentPassword) {
        return response.unprocessableEntity({
          errors: [{ message: tHttp(i18n, 'currentPasswordRequired') }],
        });
      }

      const isValid = await hash.verify(user.password, payload.currentPassword);

      if (!isValid) {
        return response.unprocessableEntity({
          errors: [{ message: tHttp(i18n, 'currentPasswordIncorrect') }],
        });
      }

      user.password = payload.newPassword;
    }

    await user.save();

    return response.ok({ data: user.toJSON() });
  }
}
