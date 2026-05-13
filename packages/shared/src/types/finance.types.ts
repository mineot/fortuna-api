export type MoneyCents = number;
export type IsoDate = string;
export type IsoDateTime = string;
export type BooleanInt = 0 | 1;

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'confirmed' | 'cancelled';

export type RecurrenceType =
  | 'subscription'
  | 'fixed_bill'
  | 'fixed_income'
  | 'monthly_fee'
  | 'other';

export type RecurrenceFrequency =
  | 'monthly'
  | 'yearly'
  | 'weekly'
  | 'biweekly'
  | 'custom';

export type CreditCardStatementStatus =
  | 'open'
  | 'closed'
  | 'paid'
  | 'cancelled';
