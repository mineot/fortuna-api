import type {
  NewRecurringTransaction,
  RecurrenceFrequency,
  RecurrenceType,
  RecurringTransactionResponse,
  RecurringTransactionUpdate,
  TransactionType,
} from '@repo/shared';

export interface RecurringTransactionsListFilters {
  limit?: number;
  offset?: number;
  active?: 0 | 1;
  accountId?: number;
  categoryId?: number;
  payeeId?: number;
  type?: TransactionType;
  recurrenceType?: RecurrenceType;
  frequency?: RecurrenceFrequency;
  dueDay?: number;
}

export interface RecurringTransactionsPort {
  create(payload: NewRecurringTransaction): Promise<RecurringTransactionResponse>;
  findById(userId: number, recurringTransactionId: number): Promise<RecurringTransactionResponse | undefined>;
  listByUser(userId: number, filters?: RecurringTransactionsListFilters): Promise<RecurringTransactionResponse[]>;
  updateById(userId: number, recurringTransactionId: number, payload: RecurringTransactionUpdate): Promise<RecurringTransactionResponse | undefined>;
  deleteById(userId: number, recurringTransactionId: number): Promise<boolean>;
}
