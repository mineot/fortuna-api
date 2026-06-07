import AccountType from '#models/account_type';
import { createAccountTypeValidator, updateAccountTypeValidator } from '#validators/account_type';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { DateTime } from 'luxon';

export default class AccountTypesController {
  private findByNormalizedName(userId: number, name: string) {
    return AccountType.query()
      .where('user_id', userId)
      .whereRaw('LOWER(name) = ?', [name.toLocaleLowerCase()]);
  }

  async index({ auth, inertia }: HttpContext) {
    const userId = auth.user!.id;

    const accountTypes = await AccountType.query()
      .where('user_id', userId)
      .where('archived', false)
      .orderBy('id', 'asc');

    return inertia.render('account-types/account-types', {
      accountTypes,
    });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createAccountTypeValidator);
    const existing = await this.findByNormalizedName(userId, payload.name).first();

    if (existing) {
      return response.conflict({ message: tHttp(i18n, 'accountTypeNameAlreadyExists') });
    }

    const accountType = await AccountType.create({
      userId,
      name: payload.name,
      description: payload.description,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: accountType });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const accountType = await AccountType.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!accountType) {
      return response.notFound({ message: tHttp(i18n, 'accountTypeNotFound') });
    }

    const payload = await request.validateUsing(updateAccountTypeValidator);

    if (payload.name.toLocaleLowerCase() !== accountType.name.toLocaleLowerCase()) {
      const existing = await this.findByNormalizedName(userId, payload.name)
        .whereNot('id', accountType.id)
        .first();

      if (existing) {
        return response.conflict({ message: tHttp(i18n, 'accountTypeNameAlreadyExists') });
      }
    }

    accountType.merge({
      name: payload.name,
      description: payload.description,
    });

    await accountType.save();

    return response.ok({ data: accountType });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const accountType = await AccountType.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!accountType) {
      return response.notFound({ message: tHttp(i18n, 'accountTypeNotFound') });
    }

    if (!accountType.archived) {
      accountType.archived = true;
      accountType.archivedAt = DateTime.now();
      await accountType.save();
    }

    return response.ok({ data: accountType });
  }
}
