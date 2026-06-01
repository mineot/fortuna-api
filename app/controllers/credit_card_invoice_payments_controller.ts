import Account from '#models/account';
import CreditCardInvoice from '#models/credit_card_invoice';
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment';
import Transaction from '#models/transaction';
import {
  createCreditCardInvoicePaymentValidator,
  updateCreditCardInvoicePaymentValidator,
} from '#validators/credit_card_invoice_payment';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class CreditCardInvoicePaymentsController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return value.toFixed(2);
  }

  private async validateLinks(
    userId: number,
    creditCardInvoiceId: number,
    accountId: number,
    transactionId?: number | null,
  ) {
    const invoice = await CreditCardInvoice.query()
      .where('id', creditCardInvoiceId)
      .where('user_id', userId)
      .where('archived', false)
      .first();
    if (!invoice) return 'Credit card invoice not found for this user';

    const account = await Account.query().where('id', accountId).where('user_id', userId).where('archived', false).first();
    if (!account) return 'Account not found for this user';

    if (transactionId !== undefined && transactionId !== null) {
      const transaction = await Transaction.query()
        .where('id', transactionId)
        .where('user_id', userId)
        .where('archived', false)
        .first();
      if (!transaction) return 'Transaction not found for this user';
    }

    return null;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const payments = await CreditCardInvoicePayment.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('invoice')
      .preload('account')
      .preload('transaction')
      .orderBy('payment_date', 'desc')
      .orderBy('id', 'desc');

    return response.ok({ data: payments });
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardInvoicePaymentValidator);

    const paymentDate = this.parseDate(payload.paymentDate);
    if (!paymentDate) {
      return response.unprocessableEntity({ message: 'Invalid payment date' });
    }

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardInvoiceId,
      payload.accountId,
      payload.transactionId,
    );
    if (linkError) return response.unprocessableEntity({ message: linkError });

    const payment = await CreditCardInvoicePayment.create({
      userId,
      creditCardInvoiceId: payload.creditCardInvoiceId,
      accountId: payload.accountId,
      transactionId: payload.transactionId ?? null,
      amount: this.formatMoney(payload.amount),
      paymentDate,
      status: payload.status ?? 'posted',
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: payment });
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id;
    const payment = await CreditCardInvoicePayment.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!payment) return response.notFound({ message: 'Credit card invoice payment not found' });

    const payload = await request.validateUsing(updateCreditCardInvoicePaymentValidator);

    const paymentDate = this.parseDate(payload.paymentDate);
    if (!paymentDate) {
      return response.unprocessableEntity({ message: 'Invalid payment date' });
    }

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardInvoiceId,
      payload.accountId,
      payload.transactionId,
    );
    if (linkError) return response.unprocessableEntity({ message: linkError });

    payment.merge({
      creditCardInvoiceId: payload.creditCardInvoiceId,
      accountId: payload.accountId,
      transactionId: payload.transactionId ?? null,
      amount: this.formatMoney(payload.amount),
      paymentDate,
      status: payload.status,
      notes: payload.notes,
    });
    await payment.save();

    return response.ok({ data: payment });
  }

  async archive({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id;
    const payment = await CreditCardInvoicePayment.query().where('id', params.id).where('user_id', userId).first();

    if (!payment) return response.notFound({ message: 'Credit card invoice payment not found' });

    if (!payment.archived) {
      payment.archived = true;
      payment.archivedAt = DateTime.now();
      await payment.save();
    }

    return response.ok({ data: payment });
  }
}
