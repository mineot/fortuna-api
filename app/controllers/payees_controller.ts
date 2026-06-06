import Payee from '#models/payee';
import { createPayeeValidator, updatePayeeValidator } from '#validators/payee';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { DateTime } from 'luxon';

export default class PayeesController {
  private findByNormalizedName(userId: number, name: string) {
    return Payee.query()
      .where('user_id', userId)
      .whereRaw('LOWER(name) = ?', [name.toLocaleLowerCase()]);
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const payees = await Payee.query()
      .where('user_id', userId)
      .where('archived', false)
      .orderBy('id', 'asc');

    return response.ok({ data: payees });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createPayeeValidator);

    const existing = await this.findByNormalizedName(userId, payload.name).first();

    if (existing) {
      return response.conflict({ message: tHttp(i18n, 'payeeNameAlreadyExists') });
    }

    const payee = await Payee.create({
      userId,
      name: payload.name,
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: payee });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const payee = await Payee.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!payee) {
      return response.notFound({ message: tHttp(i18n, 'payeeNotFound') });
    }

    const payload = await request.validateUsing(updatePayeeValidator);

    if (payload.name.toLocaleLowerCase() !== payee.name.toLocaleLowerCase()) {
      const existing = await this.findByNormalizedName(userId, payload.name)
        .whereNot('id', payee.id)
        .first();

      if (existing) {
        return response.conflict({ message: tHttp(i18n, 'payeeNameAlreadyExists') });
      }
    }

    payee.merge({
      name: payload.name,
      notes: payload.notes,
    });

    await payee.save();

    return response.ok({ data: payee });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payee = await Payee.query().where('id', params.id).where('user_id', userId).first();

    if (!payee) {
      return response.notFound({ message: tHttp(i18n, 'payeeNotFound') });
    }

    if (!payee.archived) {
      payee.archived = true;
      payee.archivedAt = DateTime.now();
      await payee.save();
    }

    return response.ok({ data: payee });
  }
}
