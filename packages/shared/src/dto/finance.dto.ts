import type { z } from 'zod';

import {
  accountSchema,
  accountTypeSchema,
  categoryGroupSchema,
  categorySchema,
  creditCardInstallmentSchema,
  creditCardPurchaseSchema,
  creditCardSchema,
  creditCardStatementSchema,
  createUserSchema,
  createCreditCardStatementPaymentSchema,
  payeeSchema,
  transactionSchema,
  transferSchema,
  userSettingsSchema,
  userSchema,
  recurringTransactionSchema,
} from '../schemas/finance.schemas';

type NullableKeys<T extends Record<string, unknown>> = {
  [K in keyof T]-?: null extends T[K] ? K : never;
}[keyof T];

type NullableToOptional<T extends Record<string, unknown>> = Omit<T, NullableKeys<T>> &
  Partial<Pick<T, NullableKeys<T>>>;

type CreateFromSchema<TSchema extends z.ZodTypeAny> = NullableToOptional<Omit<z.infer<TSchema>, 'id'>>;

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = Partial<Omit<z.infer<typeof userSchema>, 'id'>>;

export type CreateUserSettingsDto = CreateFromSchema<typeof userSettingsSchema>;
export type UpdateUserSettingsDto = Partial<CreateUserSettingsDto>;

export type CreateAccountTypeDto = CreateFromSchema<typeof accountTypeSchema>;
export type UpdateAccountTypeDto = Partial<CreateAccountTypeDto>;

export type CreateAccountDto = CreateFromSchema<typeof accountSchema>;
export type UpdateAccountDto = Partial<CreateAccountDto>;

export type CreateCategoryGroupDto = CreateFromSchema<typeof categoryGroupSchema>;
export type UpdateCategoryGroupDto = Partial<CreateCategoryGroupDto>;

export type CreateCategoryDto = CreateFromSchema<typeof categorySchema>;
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export type CreatePayeeDto = CreateFromSchema<typeof payeeSchema>;
export type UpdatePayeeDto = Partial<CreatePayeeDto>;

export type CreateTransactionDto = CreateFromSchema<typeof transactionSchema>;
export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export type CreateTransferDto = CreateFromSchema<typeof transferSchema>;
export type UpdateTransferDto = Partial<CreateTransferDto>;

export type CreateRecurringTransactionDto = CreateFromSchema<typeof recurringTransactionSchema>;
export type UpdateRecurringTransactionDto = Partial<CreateRecurringTransactionDto>;

export type CreateCreditCardDto = CreateFromSchema<typeof creditCardSchema>;
export type UpdateCreditCardDto = Partial<CreateCreditCardDto>;

export type CreateCreditCardStatementDto = CreateFromSchema<typeof creditCardStatementSchema>;
export type UpdateCreditCardStatementDto = Partial<CreateCreditCardStatementDto>;

export type CreateCreditCardPurchaseDto = CreateFromSchema<typeof creditCardPurchaseSchema>;
export type UpdateCreditCardPurchaseDto = Partial<CreateCreditCardPurchaseDto>;

export type CreateCreditCardInstallmentDto = CreateFromSchema<typeof creditCardInstallmentSchema>;
export type UpdateCreditCardInstallmentDto = Partial<CreateCreditCardInstallmentDto>;

export type CreateCreditCardStatementPaymentDto = z.infer<
  typeof createCreditCardStatementPaymentSchema
>;

export type UpdateCreditCardStatementPaymentDto = Partial<CreateCreditCardStatementPaymentDto>;
