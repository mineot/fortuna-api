export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export const TRANSACTION_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

export const RECURRENCE_TYPES = [
  'subscription',
  'fixed_bill',
  'fixed_income',
  'monthly_fee',
  'other',
] as const;

export const RECURRENCE_FREQUENCIES = [
  'monthly',
  'yearly',
  'weekly',
  'biweekly',
  'custom',
] as const;

export const CREDIT_CARD_STATEMENT_STATUSES = [
  'open',
  'closed',
  'paid',
  'cancelled',
] as const;
