import { z } from 'zod';

import {
  CREDIT_CARD_STATEMENT_STATUSES,
  RECURRENCE_FREQUENCIES,
  RECURRENCE_TYPES,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from '../constants/finance.constants';

import {
  booleanIntSchema,
  idSchema,
  isoDateSchema,
  optionalNoteSchema,
  positiveMoneyCentsSchema,
} from './common.schemas';

export const userSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const publicUserSchema = userSchema.omit({ password: true });

export const userSettingsSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  locale: z.string().trim().min(2),
  currency: z.string().trim().length(3),
  fiscal_year_cutoff_day: z.int().min(1).max(31),
  fiscal_year_cutoff_month: z.int().min(1).max(12),
});

export const accountSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  account_type_id: idSchema,
  name: z.string().trim().min(1),
  initial_balance: z.int(),
  notes: optionalNoteSchema,
});

export const accountTypeSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1),
});

export const categoryGroupSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  name: z.string().trim().min(1),
});

export const categorySchema = z.object({
  id: idSchema,
  user_id: idSchema,
  category_group_id: idSchema,
  name: z.string().trim().min(1),
  type: z.enum(TRANSACTION_TYPES),
});

export const payeeSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  name: z.string().trim().min(1),
});

export const transactionSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  account_id: idSchema,
  category_id: idSchema,
  payee_id: idSchema.nullable(),
  type: z.enum(TRANSACTION_TYPES),
  description: z.string().trim().min(1),
  amount: positiveMoneyCentsSchema,
  date: isoDateSchema,
  status: z.enum(TRANSACTION_STATUSES),
  notes: optionalNoteSchema,
});

export const transferSchema = z
  .object({
    id: idSchema,
    user_id: idSchema,
    source_account_id: idSchema,
    destination_account_id: idSchema,
    amount: positiveMoneyCentsSchema,
    date: isoDateSchema,
    description: z.string().trim().min(1).nullable(),
    status: z.enum(TRANSACTION_STATUSES),
  })
  .refine((value) => value.source_account_id !== value.destination_account_id, {
    message: 'source_account_id and destination_account_id must be different',
    path: ['destination_account_id'],
  });

export const recurringTransactionSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  account_id: idSchema,
  category_id: idSchema,
  payee_id: idSchema.nullable(),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1).nullable(),
  type: z.enum(TRANSACTION_TYPES),
  recurrence_type: z.enum(RECURRENCE_TYPES),
  amount: positiveMoneyCentsSchema,
  frequency: z.enum(RECURRENCE_FREQUENCIES),
  due_day: z.int().min(1).max(31),
  start_date: isoDateSchema,
  end_date: isoDateSchema.nullable(),
  active: booleanIntSchema,
});

export const creditCardSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  name: z.string().trim().min(1),
  credit_limit: z.int().nonnegative(),
  closing_day: z.int().min(1).max(31),
  due_day: z.int().min(1).max(31),
  notes: optionalNoteSchema,
});

export const creditCardStatementSchema = z.object({
  id: idSchema,
  credit_card_id: idSchema,
  start_date: isoDateSchema,
  end_date: isoDateSchema,
  due_date: isoDateSchema,
  status: z.enum(CREDIT_CARD_STATEMENT_STATUSES),
});

export const creditCardPurchaseSchema = z.object({
  id: idSchema,
  credit_card_id: idSchema,
  category_id: idSchema,
  payee_id: idSchema.nullable(),
  description: z.string().trim().min(1),
  total_amount: positiveMoneyCentsSchema,
  installment_count: z.int().min(1),
  purchase_date: isoDateSchema,
});

export const creditCardInstallmentSchema = z.object({
  id: idSchema,
  credit_card_purchase_id: idSchema,
  credit_card_statement_id: idSchema,
  installment_number: z.int().min(1),
  amount: positiveMoneyCentsSchema,
  competence_date: isoDateSchema,
});

export const creditCardStatementPaymentSchema = z.object({
  id: idSchema,
  credit_card_statement_id: idSchema,
  account_id: idSchema,
  amount: positiveMoneyCentsSchema,
  date: isoDateSchema,
  transaction_id: idSchema,
});

export const createCreditCardStatementPaymentSchema = creditCardStatementPaymentSchema.omit({
  id: true,
  transaction_id: true,
});
