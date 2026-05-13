export enum TransactionTypeEnum {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum RecurrenceTypeEnum {
  SUBSCRIPTION = 'subscription',
  FIXED_BILL = 'fixed_bill',
  FIXED_INCOME = 'fixed_income',
  MONTHLY_FEE = 'monthly_fee',
  OTHER = 'other',
}

export enum RecurrenceFrequencyEnum {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  CUSTOM = 'custom',
}

export enum CreditCardStatementStatusEnum {
  OPEN = 'open',
  CLOSED = 'closed',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}
