import type { z } from 'zod';
import { paginationSchema } from '../schemas/common.schemas.js';

import type {
  accountSchema,
  accountTypeSchema,
  categoryGroupSchema,
  categorySchema,
  creditCardInstallmentSchema,
  creditCardPurchaseSchema,
  creditCardSchema,
  creditCardStatementPaymentSchema,
  creditCardStatementSchema,
  payeeSchema,
  recurringTransactionSchema,
  transactionSchema,
  transferSchema,
  publicUserSchema,
  userSettingsSchema,
} from '../schemas/finance.schemas.js';

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface ValidationErrorPayload {
  code: 'VALIDATION_ERROR';
  message: string;
  fields: Array<{ field: string; message: string }>;
}

export interface DomainErrorPayload {
  code: string;
  message: string;
}

export type ListQuery = z.infer<typeof paginationSchema>;
export type UserResponse = z.infer<typeof publicUserSchema>;
export type UserSettingsResponse = z.infer<typeof userSettingsSchema>;
export type AccountTypeResponse = z.infer<typeof accountTypeSchema>;
export type AccountResponse = z.infer<typeof accountSchema>;
export type CategoryGroupResponse = z.infer<typeof categoryGroupSchema>;
export type CategoryResponse = z.infer<typeof categorySchema>;
export type PayeeResponse = z.infer<typeof payeeSchema>;
export type TransactionResponse = z.infer<typeof transactionSchema>;
export type TransferResponse = z.infer<typeof transferSchema>;
export type RecurringTransactionResponse = z.infer<typeof recurringTransactionSchema>;
export type CreditCardResponse = z.infer<typeof creditCardSchema>;
export type CreditCardStatementResponse = z.infer<typeof creditCardStatementSchema>;
export type CreditCardPurchaseResponse = z.infer<typeof creditCardPurchaseSchema>;
export type CreditCardInstallmentResponse = z.infer<typeof creditCardInstallmentSchema>;
export type CreditCardStatementPaymentResponse = z.infer<typeof creditCardStatementPaymentSchema>;
