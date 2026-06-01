import Budget from '#models/budget';
import BudgetCategory from '#models/budget_category';
import Category from '#models/category';
import {
  createBudgetCategoryValidator,
  updateBudgetCategoryValidator,
} from '#validators/budget_category';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { HTTP_MESSAGES } from '#services/http_messages';
import { DateTime } from 'luxon';
import { money } from '#services/money';

export default class BudgetCategoriesController {
  private formatMoney(value: number) {
    return money(value);
  }

  private async validateLinks(userId: number, budgetId: number, categoryId: number) {
    const budget = await Budget.query()
      .where('id', budgetId)
      .where('user_id', userId)
      .where('archived', false)
      .first();
    if (!budget) {
      return HTTP_MESSAGES.BUDGET_NOT_FOUND_FOR_USER;
    }

    const category = await Category.query()
      .where('id', categoryId)
      .where('user_id', userId)
      .where('archived', false)
      .first();
    if (!category) {
      return HTTP_MESSAGES.CATEGORY_NOT_FOUND_FOR_USER;
    }

    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const budgetCategories = await BudgetCategory.query()
      .where('user_id', userId)
      .where('archived', false)
      .whereHas('budget', (query) => query.where('archived', false))
      .preload('budget')
      .preload('category')
      .orderBy('id', 'asc');

    return response.ok({ data: budgetCategories });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createBudgetCategoryValidator);

    const linkError = await this.validateLinks(userId, payload.budgetId, payload.categoryId);
    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const existing = await BudgetCategory.query()
      .where('budget_id', payload.budgetId)
      .where('category_id', payload.categoryId)
      .first();

    if (existing) {
      return response.conflict({
        message: tHttp(i18n, 'Budget category already exists for this budget and category'),
      });
    }

    const budgetCategory = await BudgetCategory.create({
      userId,
      budgetId: payload.budgetId,
      categoryId: payload.categoryId,
      plannedAmount: this.formatMoney(payload.plannedAmount),
      carryoverAmount: this.formatMoney(payload.carryoverAmount ?? 0),
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: budgetCategory });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const budgetCategory = await BudgetCategory.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!budgetCategory) {
      return response.notFound({ message: tHttp(i18n, 'Budget category not found') });
    }

    const payload = await request.validateUsing(updateBudgetCategoryValidator);

    const linkError = await this.validateLinks(userId, payload.budgetId, payload.categoryId);
    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const existing = await BudgetCategory.query()
      .where('budget_id', payload.budgetId)
      .where('category_id', payload.categoryId)
      .whereNot('id', budgetCategory.id)
      .first();

    if (existing) {
      return response.conflict({
        message: tHttp(i18n, 'Budget category already exists for this budget and category'),
      });
    }

    budgetCategory.merge({
      budgetId: payload.budgetId,
      categoryId: payload.categoryId,
      plannedAmount: this.formatMoney(payload.plannedAmount),
      carryoverAmount: this.formatMoney(payload.carryoverAmount),
      notes: payload.notes,
    });
    await budgetCategory.save();

    return response.ok({ data: budgetCategory });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const budgetCategory = await BudgetCategory.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!budgetCategory) {
      return response.notFound({ message: tHttp(i18n, 'Budget category not found') });
    }

    if (!budgetCategory.archived) {
      budgetCategory.archived = true;
      budgetCategory.archivedAt = DateTime.now();
      await budgetCategory.save();
    }

    return response.ok({ data: budgetCategory });
  }
}
