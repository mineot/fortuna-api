import vine from '@vinejs/vine';

const amount = () => vine.number().positive().max(999999999999.99);
const status = () => vine.enum(['open', 'posted', 'cancelled'] as const);

export const createCreditCardPurchaseValidator = vine.create({
  creditCardId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  description: vine.string().trim().minLength(2).maxLength(160),
  totalAmount: amount(),
  installmentsCount: vine.number().withoutDecimals().min(1).max(480),
  purchaseDate: vine.string().trim(),
  status: status().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateCreditCardPurchaseValidator = vine.create({
  creditCardId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  description: vine.string().trim().minLength(2).maxLength(160),
  totalAmount: amount(),
  installmentsCount: vine.number().withoutDecimals().min(1).max(480),
  purchaseDate: vine.string().trim(),
  status: status(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
