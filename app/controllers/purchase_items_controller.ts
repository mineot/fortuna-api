import Category from '#models/category';
import Payee from '#models/payee';
import Purchase from '#models/purchase';
import PurchaseItem from '#models/purchase_item';
import ShoppingListItem from '#models/shopping_list_item';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';
import { money } from '#services/money';
import { tHttp } from '#services/http_i18n';
import { HTTP_MESSAGES } from '#services/http_messages';

import {
  createPurchaseItemValidator,
  updatePurchaseItemValidator,
} from '#validators/purchase_item';

export default class PurchaseItemsController {
  private formatQuantity(value: number) {
    return value.toFixed(3);
  }

  private formatMoney(value: number) {
    return money(value);
  }

  private async validateLinks(
    userId: number,
    purchaseId: number,
    shoppingListItemId?: number | null,
    categoryId?: number | null,
    payeeId?: number | null,
  ) {
    const purchase = await Purchase.query()
      .where('id', purchaseId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!purchase) {
      return HTTP_MESSAGES.PURCHASE_NOT_FOUND_FOR_USER;
    }

    if (shoppingListItemId !== undefined && shoppingListItemId !== null) {
      const item = await ShoppingListItem.query()
        .where('id', shoppingListItemId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!item) {
        return HTTP_MESSAGES.SHOPPING_LIST_ITEM_NOT_FOUND_FOR_USER;
      }
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

    const items = await PurchaseItem.query()
      .where('user_id', userId)
      .where('archived', false)
      .whereHas('purchase', (query) => query.where('archived', false))
      .preload('purchase')
      .preload('shoppingListItem')
      .preload('category')
      .preload('payee')
      .orderBy('id', 'asc');

    return response.ok({ data: items });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createPurchaseItemValidator);

    const linkError = await this.validateLinks(
      userId,
      payload.purchaseId,
      payload.shoppingListItemId,
      payload.categoryId,
      payload.payeeId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const quantity = payload.quantity ?? 1;
    const unitPrice = payload.unitPrice ?? 0;
    const totalPrice = payload.totalPrice ?? Math.round(quantity * unitPrice * 100) / 100;

    const item = await PurchaseItem.create({
      userId,
      purchaseId: payload.purchaseId,
      shoppingListItemId: payload.shoppingListItemId ?? null,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      name: payload.name,
      quantity: this.formatQuantity(quantity),
      unitPrice: this.formatMoney(unitPrice),
      totalPrice: this.formatMoney(totalPrice),
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: item });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const item = await PurchaseItem.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!item) {
      return response.notFound({ message: tHttp(i18n, 'purchaseItemNotFound') });
    }

    const payload = await request.validateUsing(updatePurchaseItemValidator);

    const linkError = await this.validateLinks(
      userId,
      payload.purchaseId,
      payload.shoppingListItemId,
      payload.categoryId,
      payload.payeeId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    item.merge({
      purchaseId: payload.purchaseId,
      shoppingListItemId: payload.shoppingListItemId ?? null,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      name: payload.name,
      quantity: this.formatQuantity(payload.quantity),
      unitPrice: this.formatMoney(payload.unitPrice),
      totalPrice: this.formatMoney(payload.totalPrice),
      notes: payload.notes,
    });

    await item.save();

    return response.ok({ data: item });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const item = await PurchaseItem.query().where('id', params.id).where('user_id', userId).first();

    if (!item) {
      return response.notFound({ message: tHttp(i18n, 'purchaseItemNotFound') });
    }

    if (!item.archived) {
      item.archived = true;
      item.archivedAt = DateTime.utc();
      await item.save();
    }

    return response.ok({ data: item });
  }
}
