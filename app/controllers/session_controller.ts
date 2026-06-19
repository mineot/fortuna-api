import User from '#models/user';
import { loginValidator } from '#validators/session';
import type { HttpContext } from '@adonisjs/core/http';

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {});
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator);
    const user = await User.verifyCredentials(email, password);

    await auth.use('web').login(user);

    return response.redirect().toRoute('home');
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout();

    return response.redirect().toRoute('session.create');
  }
}
