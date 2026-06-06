import CreditCardInstallment from '#models/credit_card_installment';
import CreditCardInvoice from '#models/credit_card_invoice';
import CreditCardPurchase from '#models/credit_card_purchase';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { HTTP_MESSAGES } from '#services/http_messages';
import { DateTime } from 'luxon';
import { money } from '#services/money';

import {
  createCreditCardInstallmentValidator,
  updateCreditCardInstallmentValidator,
} from '#validators/credit_card_installment';

export default class CreditCardInstallmentsController {
  private parseDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return money(value);
  }

  private async validateLinks(userId: number, purchaseId: number, invoiceId?: number | null) {
    const purchase = await CreditCardPurchase.query()
      .where('id', purchaseId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!purchase) {
      return HTTP_MESSAGES.CREDIT_CARD_PURCHASE_NOT_FOUND_FOR_USER;
    }

    if (invoiceId !== undefined && invoiceId !== null) {
      const invoice = await CreditCardInvoice.query()
        .where('id', invoiceId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!invoice) {
        return HTTP_MESSAGES.CREDIT_CARD_INVOICE_NOT_FOUND_FOR_USER;
      }

      if (invoice.creditCardId !== purchase.creditCardId) {
        return HTTP_MESSAGES.CREDIT_CARD_INVOICE_MISMATCH_PURCHASE;
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

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCreditCardInstallmentValidator);
    const dueDate = this.parseDate(payload.dueDate);

    if (!dueDate) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'invalidInstallmentDueDate') });
    }

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardPurchaseId,
      payload.creditCardInvoiceId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const existing = await CreditCardInstallment.query()
      .where('credit_card_purchase_id', payload.creditCardPurchaseId)
      .where('installment_number', payload.installmentNumber)
      .first();

    if (existing) {
      return response.conflict({
        message: tHttp(i18n, 'installmentNumberAlreadyExistsForPurchase'),
      });
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

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const installment = await CreditCardInstallment.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!installment) {
      return response.notFound({ message: tHttp(i18n, 'creditCardInstallmentNotFound') });
    }

    const payload = await request.validateUsing(updateCreditCardInstallmentValidator);
    const dueDate = this.parseDate(payload.dueDate);

    if (!dueDate) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'invalidInstallmentDueDate') });
    }

    const linkError = await this.validateLinks(
      userId,
      payload.creditCardPurchaseId,
      payload.creditCardInvoiceId,
    );

    if (linkError) {
      return response.unprocessableEntity({ message: tHttp(i18n, linkError) });
    }

    const existing = await CreditCardInstallment.query()
      .where('credit_card_purchase_id', payload.creditCardPurchaseId)
      .where('installment_number', payload.installmentNumber)
      .whereNot('id', installment.id)
      .first();

    if (existing) {
      return response.conflict({
        message: tHttp(i18n, 'installmentNumberAlreadyExistsForPurchase'),
      });
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

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const installment = await CreditCardInstallment.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!installment) {
      return response.notFound({ message: tHttp(i18n, 'creditCardInstallmentNotFound') });
    }

    if (!installment.archived) {
      installment.archived = true;
      installment.archivedAt = DateTime.now();
      await installment.save();
    }

    return response.ok({ data: installment });
  }
}
