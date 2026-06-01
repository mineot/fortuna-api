import Category from '#models/category';
import CreditCard from '#models/credit_card';
import CreditCardPurchase from '#models/credit_card_purchase';
import Payee from '#models/payee';
import {
  createCreditCardPurchaseValidator,
  updateCreditCardPurchaseValidator,
} from '#validators/credit_card_purchase';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class CreditCardPurchasesController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return value.toFixed(2);
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
    if (!creditCard) return 'Credit card not found for this user';

    if (categoryId !== undefined && categoryId !== null) {
      const category = await Category.query()
        .where('id', categoryId)
        .where('user_id', userId)
        .where('archived', false)
        .first();
      if (!category) return 'Category not found for this user';
    }

    if (payeeId !== undefined && payeeId !== null) {
      const payee = await Payee.query()
        .where('id', payeeId)
        .where('user_id', userId)
        .where('archived', false)
        .first();
      if (!payee) return 'Payee not found for this user';
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

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardPurchaseValidator);

    const purchaseDate = this.parseDate(payload.purchaseDate);
    if (!purchaseDate) return response.unprocessableEntity({ message: 'Invalid purchase date' });

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardId,
      payload.categoryId,
      payload.payeeId,
    );
    if (linkError) return response.unprocessableEntity({ message: linkError });

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

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const purchase = await CreditCardPurchase.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!purchase) return response.notFound({ message: 'Credit card purchase not found' });

    const payload = await request.validateUsing(updateCreditCardPurchaseValidator);

    const purchaseDate = this.parseDate(payload.purchaseDate);
    if (!purchaseDate) return response.unprocessableEntity({ message: 'Invalid purchase date' });

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardId,
      payload.categoryId,
      payload.payeeId,
    );
    if (linkError) return response.unprocessableEntity({ message: linkError });

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

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const purchase = await CreditCardPurchase.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!purchase) return response.notFound({ message: 'Credit card purchase not found' });

    if (!purchase.archived) {
      purchase.archived = true;
      purchase.archivedAt = DateTime.now();
      await purchase.save();
    }

    return response.ok({ data: purchase });
  }
}
