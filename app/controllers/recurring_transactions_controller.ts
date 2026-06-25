import Account from '#models/account';
import Category from '#models/category';
import Payee from '#models/payee';
import RecurringTransaction from '#models/recurring_transaction';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';
import { money } from '#services/money';
import { tHttp } from '#services/http_i18n';
import { HTTP_MESSAGES } from '#services/http_messages';
import { parseDateISO, parseOptionalDateISO } from '#services/date_utils';

import {
  createRecurringTransactionValidator,
  updateRecurringTransactionValidator,
} from '#validators/recurring_transaction';

export default class RecurringTransactionsController {
  private formatMoney(value: number) {
    return money(value);
  }

  private async validateLinks(
    userId: number,
    accountId: number,
    categoryId?: number | null,
    payeeId?: number | null,
  ) {
    const account = await Account.query()
      .where('id', accountId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!account) {
      return HTTP_MESSAGES.ACCOUNT_NOT_FOUND_FOR_USER;
    }

    if (categoryId !== undefined && categoryId !== null) {
      const category = await Category.query()
        .where('id', categoryId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!category) {
        return HTTP_MESSAGES.CATEGORY_NOT_FOUND_FOR_USER;
      }
    }

    if (payeeId !== undefined && payeeId !== null) {
      const payee = await Payee.query()
        .where('id', payeeId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!payee) {
        return HTTP_MESSAGES.PAYEE_NOT_FOUND_FOR_USER;
      }
    }

    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const recurringTransactions = await RecurringTransaction.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('account')
      .preload('category')
      .preload('payee')
      .orderBy('next_occurrence_date', 'asc')
      .orderBy('id', 'asc');

    return response.ok({ data: recurringTransactions });
  }

  async store({ auth, request, response, i18n, userTimezone }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createRecurringTransactionValidator);
    const startDate = parseDateISO(payload.startDate, userTimezone);
    const endDate = parseOptionalDateISO(payload.endDate, userTimezone);
    const nextOccurrenceDate = parseDateISO(payload.nextOccurrenceDate, userTimezone);

    if (endDate && endDate < startDate) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'endDateMustBeGreaterThanOrEqualToStartDate'),
      });
    }

    const linkError = await this.validateLinks(
      userId,
      payload.accountId,
      payload.categoryId,
      payload.payeeId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const recurringTransaction = await RecurringTransaction.create({
      userId,
      accountId: payload.accountId,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      type: payload.type,
      amount: this.formatMoney(payload.amount),
      frequency: payload.frequency,
      interval: payload.interval,
      startDate,
      endDate,
      nextOccurrenceDate,
      status: payload.status ?? 'active',
      description: payload.description,
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: recurringTransaction });
  }

  async update({ auth, params, request, response, i18n, userTimezone }: HttpContext) {
    const userId = auth.user!.id;

    const recurringTransaction = await RecurringTransaction.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!recurringTransaction) {
      return response.notFound({ message: tHttp(i18n, 'recurringTransactionNotFound') });
    }

    const payload = await request.validateUsing(updateRecurringTransactionValidator);
    const startDate = parseDateISO(payload.startDate, userTimezone);
    const endDate = parseOptionalDateISO(payload.endDate, userTimezone);
    const nextOccurrenceDate = parseDateISO(payload.nextOccurrenceDate, userTimezone);

    if (endDate && endDate < startDate) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'endDateMustBeGreaterThanOrEqualToStartDate'),
      });
    }

    const linkError = await this.validateLinks(
      userId,
      payload.accountId,
      payload.categoryId,
      payload.payeeId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    recurringTransaction.merge({
      accountId: payload.accountId,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      type: payload.type,
      amount: this.formatMoney(payload.amount),
      frequency: payload.frequency,
      interval: payload.interval,
      startDate,
      endDate,
      nextOccurrenceDate,
      status: payload.status,
      description: payload.description,
      notes: payload.notes,
    });

    await recurringTransaction.save();

    return response.ok({ data: recurringTransaction });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const recurringTransaction = await RecurringTransaction.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!recurringTransaction) {
      return response.notFound({ message: tHttp(i18n, 'recurringTransactionNotFound') });
    }

    if (!recurringTransaction.archived) {
      recurringTransaction.archived = true;
      recurringTransaction.archivedAt = DateTime.utc();
      await recurringTransaction.save();
    }

    return response.ok({ data: recurringTransaction });
  }
}
