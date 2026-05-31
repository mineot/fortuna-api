import AccountType from '#models/account_type';
import { createAccountTypeValidator, updateAccountTypeValidator } from '#validators/account_type';
import type { HttpContext } from '@adonisjs/core/http';
import i18nManager from '@adonisjs/i18n/services/main';
import { DateTime } from 'luxon';

export default class AccountTypesController {
  async index({ auth, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const fallbackLocale = i18nManager.getFallbackLocaleFor(i18n.locale);

    const accountTypes = await AccountType.queryTranslated(i18n.locale, fallbackLocale, userId)
      .where('user_id', userId)
      .where('archived', false)
      .orderBy('id', 'asc');

    return response.ok({ data: accountTypes });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createAccountTypeValidator);

    const existing = await AccountType.query()
      .where('user_id', userId)
      .where('term_key', payload.termKey)
      .first();

    if (existing) {
      return response.conflict({ message: 'Account type term key already exists' });
    }

    const accountType = await AccountType.create({
      userId,
      termKey: payload.termKey,
      descriptionTermKey: payload.description ? `${payload.termKey}.description` : null,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: accountType });
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const accountType = await AccountType.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!accountType) {
      return response.notFound({ message: 'Account type not found' });
    }

    const payload = await request.validateUsing(updateAccountTypeValidator);

    if (payload.termKey !== accountType.termKey) {
      const existing = await AccountType.query()
        .where('user_id', userId)
        .where('term_key', payload.termKey)
        .whereNot('id', accountType.id)
        .first();

      if (existing) {
        return response.conflict({ message: 'Account type term key already exists' });
      }
    }

    accountType.merge({
      termKey: payload.termKey,
      descriptionTermKey: payload.description ? `${payload.termKey}.description` : null,
    });
    await accountType.save();

    return response.ok({ data: accountType });
  }

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const accountType = await AccountType.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!accountType) {
      return response.notFound({ message: 'Account type not found' });
    }

    if (!accountType.archived) {
      accountType.archived = true;
      accountType.archivedAt = DateTime.now();
      await accountType.save();
    }

    return response.ok({ data: accountType });
  }
}
