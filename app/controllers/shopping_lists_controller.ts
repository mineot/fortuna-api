import ShoppingList from '#models/shopping_list';
import { createShoppingListValidator, updateShoppingListValidator } from '#validators/shopping_list';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class ShoppingListsController {
  private parseDate(value?: string | null) {
    if (!value) return null;
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private findByNormalizedName(userId: number, name: string) {
    return ShoppingList.query().where('user_id', userId).whereRaw('LOWER(name) = ?', [name.toLocaleLowerCase()]);
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const shoppingLists = await ShoppingList.query()
      .where('user_id', userId)
      .where('archived', false)
      .orderBy('id', 'desc');

    return response.ok({ data: shoppingLists });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createShoppingListValidator);

    const targetDate = this.parseDate(payload.targetDate);
    if (payload.targetDate && !targetDate) {
      return response.unprocessableEntity({ message: 'Invalid target date' });
    }

    const existing = await this.findByNormalizedName(userId, payload.name).first();
    if (existing) {
      return response.conflict({ message: 'Shopping list name already exists' });
    }

    const shoppingList = await ShoppingList.create({
      userId,
      name: payload.name,
      status: payload.status ?? 'open',
      targetDate,
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: shoppingList });
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const shoppingList = await ShoppingList.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!shoppingList) return response.notFound({ message: 'Shopping list not found' });

    const payload = await request.validateUsing(updateShoppingListValidator);

    const targetDate = this.parseDate(payload.targetDate);
    if (payload.targetDate && !targetDate) {
      return response.unprocessableEntity({ message: 'Invalid target date' });
    }

    if (payload.name.toLocaleLowerCase() !== shoppingList.name.toLocaleLowerCase()) {
      const existing = await this.findByNormalizedName(userId, payload.name)
        .whereNot('id', shoppingList.id)
        .first();

      if (existing) {
        return response.conflict({ message: 'Shopping list name already exists' });
      }
    }

    shoppingList.merge({
      name: payload.name,
      status: payload.status,
      targetDate,
      notes: payload.notes,
    });
    await shoppingList.save();

    return response.ok({ data: shoppingList });
  }

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const shoppingList = await ShoppingList.query().where('id', params.id).where('user_id', userId).first();

    if (!shoppingList) return response.notFound({ message: 'Shopping list not found' });

    if (!shoppingList.archived) {
      shoppingList.archived = true;
      shoppingList.archivedAt = DateTime.now();
      await shoppingList.save();
    }

    return response.ok({ data: shoppingList });
  }
}
