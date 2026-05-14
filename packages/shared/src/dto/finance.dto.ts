import type { z } from 'zod';

import {
  createAccountSchema,
  createAccountTypeSchema,
  createCategoryGroupSchema,
  createCategorySchema,
  createCreditCardInstallmentSchema,
  createCreditCardPurchaseSchema,
  createCreditCardSchema,
  createCreditCardStatementPaymentSchema,
  createCreditCardStatementSchema,
  createPayeeSchema,
  createRecurringTransactionSchema,
  createTransactionSchema,
  createTransferSchema,
  createUserSchema,
  createUserSettingsSchema,
  updateAccountSchema,
  updateAccountTypeSchema,
  updateCategoryGroupSchema,
  updateCategorySchema,
  updateCreditCardInstallmentSchema,
  updateCreditCardPurchaseSchema,
  updateCreditCardSchema,
  updateCreditCardStatementPaymentSchema,
  updateCreditCardStatementSchema,
  updatePayeeSchema,
  updateRecurringTransactionSchema,
  updateTransactionSchema,
  updateTransferSchema,
  updateUserSchema,
  updateUserSettingsSchema,
} from '../schemas/finance.schemas';

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export type CreateUserSettingsDto = z.infer<typeof createUserSettingsSchema>;
export type UpdateUserSettingsDto = z.infer<typeof updateUserSettingsSchema>;

export type CreateAccountTypeDto = z.infer<typeof createAccountTypeSchema>;
export type UpdateAccountTypeDto = z.infer<typeof updateAccountTypeSchema>;

export type CreateAccountDto = z.infer<typeof createAccountSchema>;
export type UpdateAccountDto = z.infer<typeof updateAccountSchema>;

export type CreateCategoryGroupDto = z.infer<typeof createCategoryGroupSchema>;
export type UpdateCategoryGroupDto = z.infer<typeof updateCategoryGroupSchema>;

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

export type CreatePayeeDto = z.infer<typeof createPayeeSchema>;
export type UpdatePayeeDto = z.infer<typeof updatePayeeSchema>;

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;

export type CreateTransferDto = z.infer<typeof createTransferSchema>;
export type UpdateTransferDto = z.infer<typeof updateTransferSchema>;

export type CreateRecurringTransactionDto = z.infer<typeof createRecurringTransactionSchema>;
export type UpdateRecurringTransactionDto = z.infer<typeof updateRecurringTransactionSchema>;

export type CreateCreditCardDto = z.infer<typeof createCreditCardSchema>;
export type UpdateCreditCardDto = z.infer<typeof updateCreditCardSchema>;

export type CreateCreditCardStatementDto = z.infer<typeof createCreditCardStatementSchema>;
export type UpdateCreditCardStatementDto = z.infer<typeof updateCreditCardStatementSchema>;

export type CreateCreditCardPurchaseDto = z.infer<typeof createCreditCardPurchaseSchema>;
export type UpdateCreditCardPurchaseDto = z.infer<typeof updateCreditCardPurchaseSchema>;

export type CreateCreditCardInstallmentDto = z.infer<typeof createCreditCardInstallmentSchema>;
export type UpdateCreditCardInstallmentDto = z.infer<typeof updateCreditCardInstallmentSchema>;

export type CreateCreditCardStatementPaymentDto = z.infer<
  typeof createCreditCardStatementPaymentSchema
>;
export type UpdateCreditCardStatementPaymentDto = z.infer<
  typeof updateCreditCardStatementPaymentSchema
>;
