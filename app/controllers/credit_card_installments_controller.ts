import CreditCardInstallment from '#models/credit_card_installment';
import CreditCardInvoice from '#models/credit_card_invoice';
import CreditCardPurchase from '#models/credit_card_purchase';
import {
  createCreditCardInstallmentValidator,
  updateCreditCardInstallmentValidator,
} from '#validators/credit_card_installment';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class CreditCardInstallmentsController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return value.toFixed(2);
  }

  private async validateLinks(userId: number, purchaseId: number, invoiceId?: number | null) {
    const purchase = await CreditCardPurchase.query()
      .where('id', purchaseId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!purchase) return 'Credit card purchase not found for this user';

    if (invoiceId !== undefined && invoiceId !== null) {
      const invoice = await CreditCardInvoice.query()
        .where('id', invoiceId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!invoice) return 'Credit card invoice not found for this user';

      if (invoice.creditCardId !== purchase.creditCardId) {
        return 'Credit card invoice does not match the purchase credit card';
      }
    }

    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const installments = await CreditCardInstallment.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('purchase')
      .preload('invoice')
      .orderBy('due_date', 'asc')
      .orderBy('id', 'asc');

    return response.ok({ data: installments });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardInstallmentValidator);

    const dueDate = this.parseDate(payload.dueDate);
    if (!dueDate) return response.unprocessableEntity({ message: 'Invalid installment due date' });

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardPurchaseId,
      payload.creditCardInvoiceId,
    );
    if (linkError) return response.unprocessableEntity({ message: linkError });

    const existing = await CreditCardInstallment.query()
      .where('credit_card_purchase_id', payload.creditCardPurchaseId)
      .where('installment_number', payload.installmentNumber)
      .first();

    if (existing) {
      return response.conflict({ message: 'Installment number already exists for this purchase' });
    }

    const installment = await CreditCardInstallment.create({
      userId,
      creditCardPurchaseId: payload.creditCardPurchaseId,
      creditCardInvoiceId: payload.creditCardInvoiceId ?? null,
      installmentNumber: payload.installmentNumber,
      amount: this.formatMoney(payload.amount),
      dueDate,
      status: payload.status ?? 'open',
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: installment });
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const installment = await CreditCardInstallment.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!installment) return response.notFound({ message: 'Credit card installment not found' });

    const payload = await request.validateUsing(updateCreditCardInstallmentValidator);

    const dueDate = this.parseDate(payload.dueDate);
    if (!dueDate) return response.unprocessableEntity({ message: 'Invalid installment due date' });

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardPurchaseId,
      payload.creditCardInvoiceId,
    );
    if (linkError) return response.unprocessableEntity({ message: linkError });

    const existing = await CreditCardInstallment.query()
      .where('credit_card_purchase_id', payload.creditCardPurchaseId)
      .where('installment_number', payload.installmentNumber)
      .whereNot('id', installment.id)
      .first();

    if (existing) {
      return response.conflict({ message: 'Installment number already exists for this purchase' });
    }

    installment.merge({
      creditCardPurchaseId: payload.creditCardPurchaseId,
      creditCardInvoiceId: payload.creditCardInvoiceId ?? null,
      installmentNumber: payload.installmentNumber,
      amount: this.formatMoney(payload.amount),
      dueDate,
      status: payload.status,
      notes: payload.notes,
    });
    await installment.save();

    return response.ok({ data: installment });
  }

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const installment = await CreditCardInstallment.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!installment) return response.notFound({ message: 'Credit card installment not found' });

    if (!installment.archived) {
      installment.archived = true;
      installment.archivedAt = DateTime.now();
      await installment.save();
    }

    return response.ok({ data: installment });
  }
}
