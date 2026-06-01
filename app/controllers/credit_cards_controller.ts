import Account from '#models/account';
import CreditCard from '#models/credit_card';
import { createCreditCardValidator, updateCreditCardValidator } from '#validators/credit_card';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class CreditCardsController {
  private formatMoney(value: number) {
    return value.toFixed(2);
  }

  private findByNormalizedName(userId: number, name: string) {
    return CreditCard.query().where('user_id', userId).whereRaw('LOWER(name) = ?', [name.toLocaleLowerCase()]);
  }

  private async validateAccountLink(userId: number, accountId?: number | null) {
    if (accountId === undefined || accountId === null) return null;

    const account = await Account.query()
      .where('id', accountId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!account) return 'Account not found for this user';
    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const creditCards = await CreditCard.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('account')
      .orderBy('id', 'asc');

    return response.ok({ data: creditCards });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardValidator);

    const linkError = await this.validateAccountLink(userId, payload.accountId);
    if (linkError) return response.unprocessableEntity({ message: linkError });

    const existing = await this.findByNormalizedName(userId, payload.name).first();
    if (existing) {
      return response.conflict({ message: 'Credit card name already exists' });
    }

    const creditCard = await CreditCard.create({
      userId,
      accountId: payload.accountId ?? null,
      name: payload.name,
      brand: payload.brand,
      lastFourDigits: payload.lastFourDigits,
      creditLimit: this.formatMoney(payload.creditLimit),
      closingDay: payload.closingDay,
      dueDay: payload.dueDay,
      status: payload.status ?? 'active',
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: creditCard });
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const creditCard = await CreditCard.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!creditCard) {
      return response.notFound({ message: 'Credit card not found' });
    }

    const payload = await request.validateUsing(updateCreditCardValidator);

    const linkError = await this.validateAccountLink(userId, payload.accountId);
    if (linkError) return response.unprocessableEntity({ message: linkError });

    if (payload.name.toLocaleLowerCase() !== creditCard.name.toLocaleLowerCase()) {
      const existing = await this.findByNormalizedName(userId, payload.name)
        .whereNot('id', creditCard.id)
        .first();

      if (existing) {
        return response.conflict({ message: 'Credit card name already exists' });
      }
    }

    creditCard.merge({
      accountId: payload.accountId ?? null,
      name: payload.name,
      brand: payload.brand,
      lastFourDigits: payload.lastFourDigits,
      creditLimit: this.formatMoney(payload.creditLimit),
      closingDay: payload.closingDay,
      dueDay: payload.dueDay,
      status: payload.status,
      notes: payload.notes,
    });
    await creditCard.save();

    return response.ok({ data: creditCard });
  }

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const creditCard = await CreditCard.query().where('id', params.id).where('user_id', userId).first();

    if (!creditCard) {
      return response.notFound({ message: 'Credit card not found' });
    }

    if (!creditCard.archived) {
      creditCard.archived = true;
      creditCard.archivedAt = DateTime.now();
      await creditCard.save();
    }

    return response.ok({ data: creditCard });
  }
}
