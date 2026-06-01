import Budget from '#models/budget';
import { createBudgetValidator, updateBudgetValidator } from '#validators/budget';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { DateTime } from 'luxon';

export default class BudgetsController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const budgets = await Budget.query()
      .where('user_id', userId)
      .where('archived', false)
      .orderBy('period_start', 'desc')
      .orderBy('id', 'desc');

    return response.ok({ data: budgets });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createBudgetValidator);

    const periodStart = this.parseDate(payload.periodStart);
    const periodEnd = this.parseDate(payload.periodEnd);

    if (!periodStart || !periodEnd) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'Invalid budget period dates') });
    }

    if (periodEnd < periodStart) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Period end must be greater than or equal to period start'),
      });
    }

    const existing = await Budget.query()
      .where('user_id', userId)
      .whereRaw('LOWER(name) = ?', [payload.name.toLocaleLowerCase()])
      .where('period_start', periodStart.toSQLDate()!)
      .first();

    if (existing) {
      return response.conflict({
        message: tHttp(i18n, 'Budget already exists for this name and period start'),
      });
    }

    const budget = await Budget.create({
      userId,
      name: payload.name,
      periodStart,
      periodEnd,
      status: payload.status ?? 'active',
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: budget });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const budget = await Budget.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!budget) {
      return response.notFound({ message: tHttp(i18n, 'Budget not found') });
    }

    const payload = await request.validateUsing(updateBudgetValidator);

    const periodStart = this.parseDate(payload.periodStart);
    const periodEnd = this.parseDate(payload.periodEnd);

    if (!periodStart || !periodEnd) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'Invalid budget period dates') });
    }

    if (periodEnd < periodStart) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Period end must be greater than or equal to period start'),
      });
    }

    const existing = await Budget.query()
      .where('user_id', userId)
      .whereRaw('LOWER(name) = ?', [payload.name.toLocaleLowerCase()])
      .where('period_start', periodStart.toSQLDate()!)
      .whereNot('id', budget.id)
      .first();

    if (existing) {
      return response.conflict({
        message: tHttp(i18n, 'Budget already exists for this name and period start'),
      });
    }

    budget.merge({
      name: payload.name,
      periodStart,
      periodEnd,
      status: payload.status,
      notes: payload.notes,
    });
    await budget.save();

    return response.ok({ data: budget });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const budget = await Budget.query().where('id', params.id).where('user_id', userId).first();

    if (!budget) {
      return response.notFound({ message: tHttp(i18n, 'Budget not found') });
    }

    if (!budget.archived) {
      budget.archived = true;
      budget.archivedAt = DateTime.now();
      await budget.save();
    }

    return response.ok({ data: budget });
  }
}
