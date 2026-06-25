export const TRANSACTION_TYPES = ['expense', 'income'] as const;
export const TRANSACTION_STATUSES = ['posted', 'pending'] as const;

export const TRANSFER_STATUSES = ['posted', 'pending'] as const;

export const RECURRING_TYPES = ['expense', 'income'] as const;
export const RECURRING_FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'] as const;
export const RECURRING_STATUSES = ['active', 'paused', 'ended'] as const;

export const BUDGET_STATUSES = ['active', 'closed'] as const;

export const CREDIT_CARD_STATUSES = ['active', 'blocked', 'closed'] as const;
export const CREDIT_CARD_INVOICE_STATUSES = ['open', 'closed', 'overdue'] as const;
export const CREDIT_CARD_PURCHASE_STATUSES = ['open', 'posted', 'cancelled'] as const;
export const CREDIT_CARD_INSTALLMENT_STATUSES = ['open', 'paid', 'cancelled'] as const;
export const CREDIT_CARD_INVOICE_PAYMENT_STATUSES = ['posted', 'pending', 'failed'] as const;

export const SHOPPING_LIST_STATUSES = ['open', 'done', 'cancelled'] as const;

export const PURCHASE_STATUSES = ['open', 'paid', 'cancelled'] as const;

export const TIMEZONES = Intl.supportedValuesOf('timeZone');
