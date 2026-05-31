import vine from '@vinejs/vine';

const amount = () => vine.number().positive().max(999999999999.99);
const frequency = () => vine.enum(['daily', 'weekly', 'monthly', 'yearly'] as const);
const recurringType = () => vine.enum(['expense', 'income'] as const);
const recurringStatus = () => vine.enum(['active', 'paused', 'ended'] as const);

export const createRecurringTransactionValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  type: recurringType(),
  amount: amount(),
  frequency: frequency(),
  interval: vine.number().withoutDecimals().min(1).max(365),
  startDate: vine.string().trim(),
  endDate: vine.string().trim().nullable().optional(),
  nextOccurrenceDate: vine.string().trim(),
  status: recurringStatus().optional(),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateRecurringTransactionValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  type: recurringType(),
  amount: amount(),
  frequency: frequency(),
  interval: vine.number().withoutDecimals().min(1).max(365),
  startDate: vine.string().trim(),
  endDate: vine.string().trim().nullable().optional(),
  nextOccurrenceDate: vine.string().trim(),
  status: recurringStatus(),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
