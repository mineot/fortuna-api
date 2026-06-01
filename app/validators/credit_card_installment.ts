import vine from '@vinejs/vine';

const amount = () => vine.number().positive().max(999999999999.99);
const status = () => vine.enum(['open', 'paid', 'cancelled'] as const);

export const createCreditCardInstallmentValidator = vine.create({
  creditCardPurchaseId: vine.number().withoutDecimals().positive(),
  creditCardInvoiceId: vine.number().withoutDecimals().positive().nullable().optional(),
  installmentNumber: vine.number().withoutDecimals().min(1).max(480),
  amount: amount(),
  dueDate: vine.string().trim(),
  status: status().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateCreditCardInstallmentValidator = vine.create({
  creditCardPurchaseId: vine.number().withoutDecimals().positive(),
  creditCardInvoiceId: vine.number().withoutDecimals().positive().nullable().optional(),
  installmentNumber: vine.number().withoutDecimals().min(1).max(480),
  amount: amount(),
  dueDate: vine.string().trim(),
  status: status(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
