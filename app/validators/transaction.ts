import vine from '@vinejs/vine';
import { TRANSACTION_STATUSES, TRANSACTION_TYPES } from '#services/domain_enums';

const amount = () => vine.number().positive().max(999999999999.99);
const transactionType = () => vine.enum(TRANSACTION_TYPES);
const transactionStatus = () => vine.enum(TRANSACTION_STATUSES);

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
