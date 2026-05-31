import vine from '@vinejs/vine';

const amount = () => vine.number().positive().max(999999999999.99);
const transactionType = () => vine.enum(['expense', 'income'] as const);
const transactionStatus = () => vine.enum(['posted', 'pending'] as const);

export const createTransactionValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  type: transactionType(),
  amount: amount(),
  transactionDate: vine.string().trim(),
  status: transactionStatus().optional(),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateTransactionValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  type: transactionType(),
  amount: amount(),
  transactionDate: vine.string().trim(),
  status: transactionStatus(),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
