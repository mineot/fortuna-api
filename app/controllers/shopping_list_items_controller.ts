import ShoppingList from '#models/shopping_list';
import ShoppingListItem from '#models/shopping_list_item';
import {
  createShoppingListItemValidator,
  updateShoppingListItemValidator,
} from '#validators/shopping_list_item';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class ShoppingListItemsController {
  private formatDecimal(value: number, scale = 3) {
    return value.toFixed(scale);
  }

  private formatMoney(value: number) {
    return value.toFixed(2);
  }

  private async validateShoppingListLink(userId: number, shoppingListId: number) {
    const shoppingList = await ShoppingList.query()
      .where('id', shoppingListId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!shoppingList) return 'Shopping list not found for this user';
    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const items = await ShoppingListItem.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('shoppingList')
      .orderBy('position', 'asc')
      .orderBy('id', 'asc');

    return response.ok({ data: items });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createShoppingListItemValidator);

    const linkError = await this.validateShoppingListLink(userId, payload.shoppingListId);
    if (linkError) return response.unprocessableEntity({ message: linkError });

    const item = await ShoppingListItem.create({
      userId,
      shoppingListId: payload.shoppingListId,
      name: payload.name,
      quantity: this.formatDecimal(payload.quantity ?? 1),
      unit: payload.unit,
      estimatedPrice:
        payload.estimatedPrice === undefined || payload.estimatedPrice === null
          ? null
          : this.formatMoney(payload.estimatedPrice),
      checked: payload.checked ?? false,
      position: payload.position ?? 0,
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: item });
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const item = await ShoppingListItem.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!item) return response.notFound({ message: 'Shopping list item not found' });

    const payload = await request.validateUsing(updateShoppingListItemValidator);

    const linkError = await this.validateShoppingListLink(userId, payload.shoppingListId);
    if (linkError) return response.unprocessableEntity({ message: linkError });

    item.merge({
      shoppingListId: payload.shoppingListId,
      name: payload.name,
      quantity: this.formatDecimal(payload.quantity),
      unit: payload.unit,
      estimatedPrice:
        payload.estimatedPrice === undefined || payload.estimatedPrice === null
          ? null
          : this.formatMoney(payload.estimatedPrice),
      checked: payload.checked,
      position: payload.position,
      notes: payload.notes,
    });
    await item.save();

    return response.ok({ data: item });
  }

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const item = await ShoppingListItem.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!item) return response.notFound({ message: 'Shopping list item not found' });

    if (!item.archived) {
      item.archived = true;
      item.archivedAt = DateTime.now();
      await item.save();
    }

    return response.ok({ data: item });
  }
}
