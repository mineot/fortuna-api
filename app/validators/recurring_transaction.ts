import vine from '@vinejs/vine';
import { RECURRING_FREQUENCIES, RECURRING_STATUSES, RECURRING_TYPES } from '#services/domain_enums';

const amount = () => vine.number().positive().max(999999999999.99);
const frequency = () => vine.enum(RECURRING_FREQUENCIES);
const recurringType = () => vine.enum(RECURRING_TYPES);
const recurringStatus = () => vine.enum(RECURRING_STATUSES);

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
