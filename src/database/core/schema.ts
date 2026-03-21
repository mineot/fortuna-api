import type { Generated } from 'kysely';

export interface MigrationTable {
  id: Generated<number>;
  name: string;
  projectVersion: string;
  appliedAt: string;
}

interface BaseTable {
  id: Generated<number>;
  createdAt: string;
  updatedAt: string;
}

// interface ArchiveTable extends BaseTable {
//   archived: boolean;
//   archivedAt?: string;
// }

export type TypeGroup =
  | 'currency'
  | 'locale'
  | 'wallet'
  | 'entity'
  | 'category'
  | 'credit-card'
  | 'credit-card-statement';

export interface TypeTable extends BaseTable {
  name: string;
  group: TypeGroup;
}

export interface MetaTable extends BaseTable {
  currency: number;
  locale: number;
  fiscalYearStartMonth: number;
  monthCutoffDay: number;
}

// export interface WalletTable extends ArchiveTable {
//   typeId: number;
//   currencyId: number;
//   name: string;
//   institution?: string;
//   initialBalance: number;
// }

// export interface EntityTable extends ArchiveTable {
//   typeId: number;
//   name: string;
//   document?: string;
//   notes?: string;
// }

// export interface CategoryTable extends ArchiveTable {
//   parentId?: number;
//   typeId: number;
//   name: string;
// }

// export interface CreditCardTable extends ArchiveTable {
//   entityId: number;
//   currencyId: number;
//   statusId: number;
//   name: string;
//   brand?: string;
//   lastDigits?: string;
//   limit: number;
//   closingDay: number;
//   dueDay: number;
//   billingWalletId: string | null;
// }

// export interface CreditCardStatementTable extends ArchiveTable {
//   creditCardId: number;
//   statusId: number;
//   periodStart: string;
//   periodEnd: string;
//   dueDate: string;
//   totalAmount: number;
// }

// export interface MovementTable {
//   id: string;
//   type: 'income' | 'expense' | 'transfer';
//   status: 'pending' | 'posted' | 'reconciled' | 'canceled';
//   date: string;
//   competencyDate: string | null;
//   amount: number;
//   description: string | null;
//   walletId: string | null;
//   entityId: string | null;
//   categoryId: string | null;
//   creditCardId: string | null;
//   creditCardStatementId: string | null;
//   originKind: 'manual' | 'import' | 'schedule' | 'subscription' | 'installment' | 'transfer';
//   originReferenceId: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreditCardStatementMovementTable {
//   statementId: number;
//   movementId: number;
// }

// export interface InstallmentTable {
//   id: string;
//   description: string;
//   entityId: string | null;
//   categoryId: string | null;
//   totalAmount: number;
//   installmentCount: number;
//   startDate: string;
//   paymentMethod: 'wallet' | 'credit_card';
//   walletId: string | null;
//   creditCardId: string | null;
//   status: 'active' | 'completed' | 'canceled';
//   createdAt: string;
//   updatedAt: string;
// }

// export interface InstallmentItemTable {
//   installmentId: string;
//   number: number;
//   dueDate: string;
//   amount: number;
//   movementId: string | null;
//   status: 'pending' | 'paid' | 'overdue' | 'canceled';
// }

// export interface PaymentScheduleTable {
//   id: string;
//   description: string;
//   type: 'income' | 'expense' | 'transfer';
//   entityId: string | null;
//   categoryId: string | null;
//   walletId: string | null;
//   amount: number;
//   recurrenceFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
//   recurrenceInterval: number;
//   recurrenceDayOfMonth: number | null;
//   recurrenceDayOfWeek: number | null;
//   startDate: string;
//   endDate: string | null;
//   autoGenerate: boolean;
//   nextDueDate: string | null;
//   status: 'active' | 'paused' | 'canceled' | 'completed';
//   createdAt: string;
//   updatedAt: string;
// }

// export interface SubscriptionTable {
//   id: string;
//   name: string;
//   entityId: string | null;
//   categoryId: string | null;
//   amount: number;
//   currency: string;
//   billingCycle: 'daily' | 'weekly' | 'monthly' | 'yearly';
//   startDate: string;
//   renewalDay: number | null;
//   paymentMethod: 'wallet' | 'credit_card';
//   walletId: string | null;
//   creditCardId: string | null;
//   autoRenew: boolean;
//   status: 'active' | 'paused' | 'canceled' | 'expired';
//   nextChargeDate: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

export interface DatabaseSchema {
  migrations: MigrationTable;
  // categories: CategoryTable;
  // creditCards: CreditCardTable;
  // creditCardStatementMovements: CreditCardStatementMovementTable;
  // creditCardStatements: CreditCardStatementTable;
  // entities: EntityTable;
  // installmentItems: InstallmentItemTable;
  // installments: InstallmentTable;
  // movements: MovementTable;
  // paymentSchedules: PaymentScheduleTable;
  // subscriptions: SubscriptionTable;
  // wallets: WalletTable;
  meta: MetaTable;
  types: TypeTable;
}
