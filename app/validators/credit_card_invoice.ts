import vine from '@vinejs/vine';

const amount = () => vine.number().min(0).max(999999999999.99);
const status = () => vine.enum(['open', 'closed', 'overdue'] as const);

export const createCreditCardInvoiceValidator = vine.create({
  creditCardId: vine.number().withoutDecimals().positive(),
  referenceMonth: vine.string().trim().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  periodStart: vine.string().trim(),
  periodEnd: vine.string().trim(),
  dueDate: vine.string().trim(),
  totalAmount: amount(),
  minimumAmount: amount(),
  paidAmount: amount().optional(),
  status: status().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateCreditCardInvoiceValidator = vine.create({
  creditCardId: vine.number().withoutDecimals().positive(),
  referenceMonth: vine.string().trim().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  periodStart: vine.string().trim(),
  periodEnd: vine.string().trim(),
  dueDate: vine.string().trim(),
  totalAmount: amount(),
  minimumAmount: amount(),
  paidAmount: amount(),
  status: status(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
