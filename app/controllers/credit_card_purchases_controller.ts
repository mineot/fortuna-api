import Category from '#models/category';
import CreditCard from '#models/credit_card';
import CreditCardPurchase from '#models/credit_card_purchase';
import Payee from '#models/payee';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { HTTP_MESSAGES } from '#services/http_messages';
import { DateTime } from 'luxon';
import { money } from '#services/money';
import { parseDateISO } from '#services/date_utils';

import {
  createCreditCardPurchaseValidator,
  updateCreditCardPurchaseValidator,
} from '#validators/credit_card_purchase';

export default class CreditCardPurchasesController {
  private formatMoney(value: number) {
    return money(value);
  }

  private async validateLinks(
    userId: number,
    creditCardId: number,
    categoryId?: number | null,
    payeeId?: number | null,
  ) {
    const creditCard = await CreditCard.query()
      .where('id', creditCardId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!creditCard) {
      return HTTP_MESSAGES.CREDIT_CARD_NOT_FOUND_FOR_USER;
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

    const purchases = await CreditCardPurchase.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('creditCard')
      .preload('category')
      .preload('payee')
      .orderBy('purchase_date', 'desc')
      .orderBy('id', 'desc');

    return response.ok({ data: purchases });
  }

  async store({ auth, request, response, i18n, userTimezone }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardPurchaseValidator);
    const purchaseDate = parseDateISO(payload.purchaseDate, userTimezone);

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardId,
      payload.categoryId,
      payload.payeeId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const purchase = await CreditCardPurchase.create({
      userId,
      creditCardId: payload.creditCardId,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      description: payload.description,
      totalAmount: this.formatMoney(payload.totalAmount),
      installmentsCount: payload.installmentsCount,
      purchaseDate,
      status: payload.status ?? 'open',
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: purchase });
  }

  async update({ auth, params, request, response, i18n, userTimezone }: HttpContext) {
    const userId = auth.user!.id;

    const purchase = await CreditCardPurchase.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!purchase) {
      return response.notFound({ message: tHttp(i18n, 'creditCardPurchaseNotFound') });
    }

    const payload = await request.validateUsing(updateCreditCardPurchaseValidator);
    const purchaseDate = parseDateISO(payload.purchaseDate, userTimezone);

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardId,
      payload.categoryId,
      payload.payeeId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    purchase.merge({
      creditCardId: payload.creditCardId,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      description: payload.description,
      totalAmount: this.formatMoney(payload.totalAmount),
      installmentsCount: payload.installmentsCount,
      purchaseDate,
      status: payload.status,
      notes: payload.notes,
    });

    await purchase.save();

    return response.ok({ data: purchase });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const purchase = await CreditCardPurchase.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!purchase) {
      return response.notFound({ message: tHttp(i18n, 'creditCardPurchaseNotFound') });
    }

    if (!purchase.archived) {
      purchase.archived = true;
      purchase.archivedAt = DateTime.utc();
      await purchase.save();
    }

    return response.ok({ data: purchase });
  }
}
