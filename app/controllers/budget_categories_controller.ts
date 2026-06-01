import Budget from '#models/budget';
import BudgetCategory from '#models/budget_category';
import Category from '#models/category';
import {
  createBudgetCategoryValidator,
  updateBudgetCategoryValidator,
} from '#validators/budget_category';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class BudgetCategoriesController {
  private formatMoney(value: number) {
    return value.toFixed(2);
  }

  private async validateLinks(userId: number, budgetId: number, categoryId: number) {
    const budget = await Budget.query()
      .where('id', budgetId)
      .where('user_id', userId)
      .where('archived', false)
      .first();
    if (!budget) {
      return 'Budget not found for this user';
    }

    const category = await Category.query()
      .where('id', categoryId)
      .where('user_id', userId)
      .where('archived', false)
      .first();
    if (!category) {
      return 'Category not found for this user';
    }

    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const budgetCategories = await BudgetCategory.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('budget')
      .preload('category')
      .orderBy('id', 'asc');

    return response.ok({ data: budgetCategories });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createBudgetCategoryValidator);

    const linkError = await this.validateLinks(userId, payload.budgetId, payload.categoryId);
    if (linkError) {
      return response.unprocessableEntity({ message: linkError });
    }

    const existing = await BudgetCategory.query()
      .where('budget_id', payload.budgetId)
      .where('category_id', payload.categoryId)
      .first();

    if (existing) {
      return response.conflict({
        message: 'Budget category already exists for this budget and category',
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

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const budgetCategory = await BudgetCategory.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!budgetCategory) {
      return response.notFound({ message: 'Budget category not found' });
    }

    const payload = await request.validateUsing(updateBudgetCategoryValidator);

    const linkError = await this.validateLinks(userId, payload.budgetId, payload.categoryId);
    if (linkError) {
      return response.unprocessableEntity({ message: linkError });
    }

    const existing = await BudgetCategory.query()
      .where('budget_id', payload.budgetId)
      .where('category_id', payload.categoryId)
      .whereNot('id', budgetCategory.id)
      .first();

    if (existing) {
      return response.conflict({
        message: 'Budget category already exists for this budget and category',
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

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const budgetCategory = await BudgetCategory.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!budgetCategory) {
      return response.notFound({ message: 'Budget category not found' });
    }

    if (!budgetCategory.archived) {
      budgetCategory.archived = true;
      budgetCategory.archivedAt = DateTime.now();
      await budgetCategory.save();
    }

    return response.ok({ data: budgetCategory });
  }
}
