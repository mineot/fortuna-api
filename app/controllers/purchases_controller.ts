import Account from '#models/account';
import Purchase from '#models/purchase';
import ShoppingList from '#models/shopping_list';
import { createPurchaseValidator, updatePurchaseValidator } from '#validators/purchase';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';
import { money } from '#services/money';
import { tHttp } from '#services/http_i18n';
import { HTTP_MESSAGES } from '#services/http_messages';

export default class PurchasesController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return money(value);
  }

  private async validateLinks(
    userId: number,
    accountId?: number | null,
    shoppingListId?: number | null,
  ) {
    if (accountId !== undefined && accountId !== null) {
      const account = await Account.query()
        .where('id', accountId)
        .where('user_id', userId)
        .where('archived', false)
        .first();
      if (!account) return HTTP_MESSAGES.ACCOUNT_NOT_FOUND_FOR_USER;
    }

    if (shoppingListId !== undefined && shoppingListId !== null) {
      const shoppingList = await ShoppingList.query()
        .where('id', shoppingListId)
        .where('user_id', userId)
        .where('archived', false)
        .first();
      if (!shoppingList) return HTTP_MESSAGES.SHOPPING_LIST_NOT_FOUND_FOR_USER;
    }

    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const purchases = await Purchase.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('account')
      .preload('shoppingList')
      .orderBy('purchase_date', 'desc')
      .orderBy('id', 'desc');

    return response.ok({ data: purchases });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createPurchaseValidator);

    const purchaseDate = this.parseDate(payload.purchaseDate);

    if (!purchaseDate) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'Invalid purchase date') });
    }

    const linkError = await this.validateLinks(userId, payload.accountId, payload.shoppingListId);

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const purchase = await Purchase.create({
      userId,
      accountId: payload.accountId ?? null,
      shoppingListId: payload.shoppingListId ?? null,
      title: payload.title,
      purchaseDate,
      totalAmount: this.formatMoney(payload.totalAmount),
      status: payload.status ?? 'open',
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: purchase });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const purchase = await Purchase.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!purchase) {
      return response.notFound({ message: tHttp(i18n, 'Purchase not found') });
    }

    const payload = await request.validateUsing(updatePurchaseValidator);
    const purchaseDate = this.parseDate(payload.purchaseDate);

    if (!purchaseDate) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'Invalid purchase date') });
    }

    const linkError = await this.validateLinks(userId, payload.accountId, payload.shoppingListId);

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    purchase.merge({
      accountId: payload.accountId ?? null,
      shoppingListId: payload.shoppingListId ?? null,
      title: payload.title,
      purchaseDate,
      totalAmount: this.formatMoney(payload.totalAmount),
      status: payload.status,
      notes: payload.notes,
    });

    await purchase.save();

    return response.ok({ data: purchase });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const purchase = await Purchase.query().where('id', params.id).where('user_id', userId).first();

    if (!purchase) {
      return response.notFound({ message: tHttp(i18n, 'Purchase not found') });
    }

    if (!purchase.archived) {
      purchase.archived = true;
      purchase.archivedAt = DateTime.now();
      await purchase.save();
    }

    return response.ok({ data: purchase });
  }
}
