import Account from '#models/account';
import AccountType from '#models/account_type';
import { createAccountValidator, updateAccountValidator } from '#validators/account';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { DateTime } from 'luxon';
import { money } from '#services/money';

export default class AccountsController {
  private findByNormalizedName(userId: number, name: string) {
    return Account.query()
      .where('user_id', userId)
      .whereRaw('LOWER(name) = ?', [name.toLocaleLowerCase()]);
  }

  private formatMoney(value: number) {
    return money(value);
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const accounts = await Account.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('accountType')
      .orderBy('id', 'asc');

    return response.ok({ data: accounts });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createAccountValidator);

    const accountType = await AccountType.query()
      .where('id', payload.accountTypeId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!accountType) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Account type not found for this user'),
      });
    }

    const existing = await this.findByNormalizedName(userId, payload.name).first();

    if (existing) {
      return response.conflict({ message: tHttp(i18n, 'Account name already exists') });
    }

    const initialBalance = this.formatMoney(payload.initialBalance ?? 0);
    const currentBalance = this.formatMoney(payload.currentBalance ?? payload.initialBalance ?? 0);

    const account = await Account.create({
      userId,
      accountTypeId: payload.accountTypeId,
      name: payload.name,
      initialBalance,
      currentBalance,
      currency: payload.currency.toUpperCase(),
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: account });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const account = await Account.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!account) {
      return response.notFound({ message: tHttp(i18n, 'Account not found') });
    }

    const payload = await request.validateUsing(updateAccountValidator);

    const accountType = await AccountType.query()
      .where('id', payload.accountTypeId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!accountType) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Account type not found for this user'),
      });
    }

    if (payload.name.toLocaleLowerCase() !== account.name.toLocaleLowerCase()) {
      const existing = await this.findByNormalizedName(userId, payload.name)
        .whereNot('id', account.id)
        .first();

      if (existing) {
        return response.conflict({ message: tHttp(i18n, 'Account name already exists') });
      }
    }

    account.merge({
      accountTypeId: payload.accountTypeId,
      name: payload.name,
      initialBalance: this.formatMoney(payload.initialBalance),
      currentBalance: this.formatMoney(payload.currentBalance),
      currency: payload.currency.toUpperCase(),
      notes: payload.notes,
    });

    await account.save();

    return response.ok({ data: account });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const account = await Account.query().where('id', params.id).where('user_id', userId).first();

    if (!account) {
      return response.notFound({ message: tHttp(i18n, 'Account not found') });
    }

    if (!account.archived) {
      account.archived = true;
      account.archivedAt = DateTime.now();
      await account.save();
    }

    return response.ok({ data: account });
  }
}
