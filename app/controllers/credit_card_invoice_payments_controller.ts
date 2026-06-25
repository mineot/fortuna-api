import Account from '#models/account';
import CreditCardInvoice from '#models/credit_card_invoice';
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment';
import Transaction from '#models/transaction';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { HTTP_MESSAGES } from '#services/http_messages';
import { DateTime } from 'luxon';
import { money } from '#services/money';
import { parseDateISO } from '#services/date_utils';

import {
  createCreditCardInvoicePaymentValidator,
  updateCreditCardInvoicePaymentValidator,
} from '#validators/credit_card_invoice_payment';

export default class CreditCardInvoicePaymentsController {
  private formatMoney(value: number) {
    return money(value);
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

    if (!invoice) {
      return HTTP_MESSAGES.CREDIT_CARD_INVOICE_NOT_FOUND_FOR_USER;
    }

    const account = await Account.query()
      .where('id', accountId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!account) {
      return HTTP_MESSAGES.ACCOUNT_NOT_FOUND_FOR_USER;
    }

    if (transactionId !== undefined && transactionId !== null) {
      const transaction = await Transaction.query()
        .where('id', transactionId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!transaction) {
        return HTTP_MESSAGES.TRANSACTION_NOT_FOUND_FOR_USER;
      }

      if (transaction.accountId !== accountId) {
        return HTTP_MESSAGES.TRANSACTION_ACCOUNT_MISMATCH_PAYMENT;
      }
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

  async store({ auth, request, response, i18n, userTimezone }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardInvoicePaymentValidator);
    const paymentDate = parseDateISO(payload.paymentDate, userTimezone);

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardInvoiceId,
      payload.accountId,
      payload.transactionId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

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

  async update({ auth, params, request, response, i18n, userTimezone }: HttpContext) {
    const userId = auth.user!.id;

    const payment = await CreditCardInvoicePayment.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!payment) {
      return response.notFound({ message: tHttp(i18n, 'creditCardInvoicePaymentNotFound') });
    }

    const payload = await request.validateUsing(updateCreditCardInvoicePaymentValidator);
    const paymentDate = parseDateISO(payload.paymentDate, userTimezone);

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardInvoiceId,
      payload.accountId,
      payload.transactionId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

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

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const payment = await CreditCardInvoicePayment.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!payment) {
      return response.notFound({ message: tHttp(i18n, 'creditCardInvoicePaymentNotFound') });
    }

    if (!payment.archived) {
      payment.archived = true;
      payment.archivedAt = DateTime.utc();
      await payment.save();
    }

    return response.ok({ data: payment });
  }
}
