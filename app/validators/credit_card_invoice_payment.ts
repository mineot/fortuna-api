import vine from '@vinejs/vine';
import { CREDIT_CARD_INVOICE_PAYMENT_STATUSES } from '#services/domain_enums';

const amount = () => vine.number().positive().max(999999999999.99);
const status = () => vine.enum(CREDIT_CARD_INVOICE_PAYMENT_STATUSES);

export const createCreditCardInvoicePaymentValidator = vine.create({
  creditCardInvoiceId: vine.number().withoutDecimals().positive(),
  accountId: vine.number().withoutDecimals().positive(),
  transactionId: vine.number().withoutDecimals().positive().nullable().optional(),
  amount: amount(),
  paymentDate: vine.string().trim(),
  status: status().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateCreditCardInvoicePaymentValidator = vine.create({
  creditCardInvoiceId: vine.number().withoutDecimals().positive(),
  accountId: vine.number().withoutDecimals().positive(),
  transactionId: vine.number().withoutDecimals().positive().nullable().optional(),
  amount: amount(),
  paymentDate: vine.string().trim(),
  status: status(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
