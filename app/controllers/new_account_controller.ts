import Setting from '#models/setting';
import User from '#models/user';
import { signupValidator } from '#validators/user';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {});
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator);
    const user = await db.transaction(async (trx) => {
      const created = await User.create({ ...payload }, { client: trx });
      await Setting.create(
        {
          userId: created.id,
          currency: 'USD',
          locale: 'en-US',
          timezone: 'UTC',
          localeInitializedAt: null,
        },
        { client: trx },
      );
      return created;
    });

    await auth.use('web').login(user);
    response.redirect().toRoute('home');
  }
}
