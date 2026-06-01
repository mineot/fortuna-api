import CreditCard from '#models/credit_card';
import CreditCardInvoice from '#models/credit_card_invoice';
import {
  createCreditCardInvoiceValidator,
  updateCreditCardInvoiceValidator,
} from '#validators/credit_card_invoice';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class CreditCardInvoicesController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return value.toFixed(2);
  }

  private async validateCreditCardLink(userId: number, creditCardId: number) {
    const creditCard = await CreditCard.query()
      .where('id', creditCardId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!creditCard) return 'Credit card not found for this user';
    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const invoices = await CreditCardInvoice.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('creditCard')
      .orderBy('due_date', 'desc')
      .orderBy('id', 'desc');

    return response.ok({ data: invoices });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardInvoiceValidator);

    const linkError = await this.validateCreditCardLink(userId, payload.creditCardId);
    if (linkError) return response.unprocessableEntity({ message: linkError });

    const periodStart = this.parseDate(payload.periodStart);
    const periodEnd = this.parseDate(payload.periodEnd);
    const dueDate = this.parseDate(payload.dueDate);

    if (!periodStart || !periodEnd || !dueDate) {
      return response.unprocessableEntity({ message: 'Invalid invoice dates' });
    }

    if (periodEnd < periodStart) {
      return response.unprocessableEntity({
        message: 'Period end must be greater than or equal to period start',
      });
    }

    const existing = await CreditCardInvoice.query()
      .where('credit_card_id', payload.creditCardId)
      .where('reference_month', payload.referenceMonth)
      .first();

    if (existing) {
      return response.conflict({
        message: 'Invoice already exists for this credit card and reference month',
      });
    }

    const invoice = await CreditCardInvoice.create({
      userId,
      creditCardId: payload.creditCardId,
      referenceMonth: payload.referenceMonth,
      periodStart,
      periodEnd,
      dueDate,
      totalAmount: this.formatMoney(payload.totalAmount),
      minimumAmount: this.formatMoney(payload.minimumAmount),
      paidAmount: this.formatMoney(payload.paidAmount ?? 0),
      status: payload.status ?? 'open',
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: invoice });
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const invoice = await CreditCardInvoice.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!invoice) {
      return response.notFound({ message: 'Credit card invoice not found' });
    }

    const payload = await request.validateUsing(updateCreditCardInvoiceValidator);

    const linkError = await this.validateCreditCardLink(userId, payload.creditCardId);
    if (linkError) return response.unprocessableEntity({ message: linkError });

    const periodStart = this.parseDate(payload.periodStart);
    const periodEnd = this.parseDate(payload.periodEnd);
    const dueDate = this.parseDate(payload.dueDate);

    if (!periodStart || !periodEnd || !dueDate) {
      return response.unprocessableEntity({ message: 'Invalid invoice dates' });
    }

    if (periodEnd < periodStart) {
      return response.unprocessableEntity({
        message: 'Period end must be greater than or equal to period start',
      });
    }

    const existing = await CreditCardInvoice.query()
      .where('credit_card_id', payload.creditCardId)
      .where('reference_month', payload.referenceMonth)
      .whereNot('id', invoice.id)
      .first();

    if (existing) {
      return response.conflict({
        message: 'Invoice already exists for this credit card and reference month',
      });
    }

    invoice.merge({
      creditCardId: payload.creditCardId,
      referenceMonth: payload.referenceMonth,
      periodStart,
      periodEnd,
      dueDate,
      totalAmount: this.formatMoney(payload.totalAmount),
      minimumAmount: this.formatMoney(payload.minimumAmount),
      paidAmount: this.formatMoney(payload.paidAmount),
      status: payload.status,
      notes: payload.notes,
    });
    await invoice.save();

    return response.ok({ data: invoice });
  }

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const invoice = await CreditCardInvoice.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!invoice) {
      return response.notFound({ message: 'Credit card invoice not found' });
    }

    if (!invoice.archived) {
      invoice.archived = true;
      invoice.archivedAt = DateTime.now();
      await invoice.save();
    }

    return response.ok({ data: invoice });
  }
}
