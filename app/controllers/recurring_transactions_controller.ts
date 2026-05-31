import Account from '#models/account';
import Category from '#models/category';
import Payee from '#models/payee';
import RecurringTransaction from '#models/recurring_transaction';
import {
  createRecurringTransactionValidator,
  updateRecurringTransactionValidator,
} from '#validators/recurring_transaction';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class RecurringTransactionsController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return value.toFixed(2);
  }

  private async validateLinks(userId: number, accountId: number, categoryId?: number | null, payeeId?: number | null) {
    const account = await Account.query()
      .where('id', accountId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!account) {
      return 'Account not found for this user';
    }

    if (categoryId !== undefined && categoryId !== null) {
      const category = await Category.query()
        .where('id', categoryId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!category) {
        return 'Category not found for this user';
      }
    }

    if (payeeId !== undefined && payeeId !== null) {
      const payee = await Payee.query()
        .where('id', payeeId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!payee) {
        return 'Payee not found for this user';
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

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createRecurringTransactionValidator);

    const startDate = this.parseDate(payload.startDate);
    const endDate = payload.endDate ? this.parseDate(payload.endDate) : null;
    const nextOccurrenceDate = this.parseDate(payload.nextOccurrenceDate);

    if (!startDate || !nextOccurrenceDate || (payload.endDate && !endDate)) {
      return response.unprocessableEntity({ message: 'Invalid recurring transaction dates' });
    }

    if (endDate && endDate < startDate) {
      return response.unprocessableEntity({ message: 'End date must be greater than or equal to start date' });
    }

    const linkError = await this.validateLinks(userId, payload.accountId, payload.categoryId, payload.payeeId);
    if (linkError) {
      return response.unprocessableEntity({ message: linkError });
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

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const recurringTransaction = await RecurringTransaction.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!recurringTransaction) {
      return response.notFound({ message: 'Recurring transaction not found' });
    }

    const payload = await request.validateUsing(updateRecurringTransactionValidator);

    const startDate = this.parseDate(payload.startDate);
    const endDate = payload.endDate ? this.parseDate(payload.endDate) : null;
    const nextOccurrenceDate = this.parseDate(payload.nextOccurrenceDate);

    if (!startDate || !nextOccurrenceDate || (payload.endDate && !endDate)) {
      return response.unprocessableEntity({ message: 'Invalid recurring transaction dates' });
    }

    if (endDate && endDate < startDate) {
      return response.unprocessableEntity({ message: 'End date must be greater than or equal to start date' });
    }

    const linkError = await this.validateLinks(userId, payload.accountId, payload.categoryId, payload.payeeId);
    if (linkError) {
      return response.unprocessableEntity({ message: linkError });
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

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const recurringTransaction = await RecurringTransaction.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!recurringTransaction) {
      return response.notFound({ message: 'Recurring transaction not found' });
    }

    if (!recurringTransaction.archived) {
      recurringTransaction.archived = true;
      recurringTransaction.archivedAt = DateTime.now();
      await recurringTransaction.save();
    }

    return response.ok({ data: recurringTransaction });
  }
}
