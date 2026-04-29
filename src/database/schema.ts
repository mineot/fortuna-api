import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'confirmed' | 'cancelled';
export type RecurrenceType = 'subscription' | 'fixed_bill' | 'fixed_income' | 'monthly_fee' | 'other';
export type RecurrenceFrequency = 'monthly' | 'yearly' | 'weekly' | 'biweekly' | 'custom';
export type CreditCardStatementStatus = 'open' | 'closed' | 'paid' | 'cancelled';

export interface MigrationTable {
  version: number;
  name: string;
  executed_at: string;
}

export interface UsersTable {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
}
export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export interface UserSettingsTable {
  id: Generated<number>;
  user_id: number;
  locale: string;
  currency: string;
  fiscal_year_cutoff_day: number;
  fiscal_year_cutoff_month: number;
}
export type UserSettings = Selectable<UserSettingsTable>;
export type NewUserSettings = Insertable<UserSettingsTable>;
export type UserSettingsUpdate = Updateable<UserSettingsTable>;

export interface AccountTypesTable {
  id: Generated<number>;
  name: string;
}
export type AccountType = Selectable<AccountTypesTable>;
export type NewAccountType = Insertable<AccountTypesTable>;
export type AccountTypeUpdate = Updateable<AccountTypesTable>;

export interface AccountsTable {
  id: Generated<number>;
  user_id: number;
  account_type_id: number;
  name: string;
  initial_balance: number;
  notes: string | null;
}
export type Account = Selectable<AccountsTable>;
export type NewAccount = Insertable<AccountsTable>;
export type AccountUpdate = Updateable<AccountsTable>;

export interface CategoryGroupsTable {
  id: Generated<number>;
  user_id: number;
  name: string;
}
export type CategoryGroup = Selectable<CategoryGroupsTable>;
export type NewCategoryGroup = Insertable<CategoryGroupsTable>;
export type CategoryGroupUpdate = Updateable<CategoryGroupsTable>;

export interface CategoriesTable {
  id: Generated<number>;
  user_id: number;
  category_group_id: number;
  name: string;
  type: TransactionType;
}
export type Category = Selectable<CategoriesTable>;
export type NewCategory = Insertable<CategoriesTable>;
export type CategoryUpdate = Updateable<CategoriesTable>;

export interface PayeesTable {
  id: Generated<number>;
  user_id: number;
  name: string;
}
export type Payee = Selectable<PayeesTable>;
export type NewPayee = Insertable<PayeesTable>;
export type PayeeUpdate = Updateable<PayeesTable>;

export interface TransactionsTable {
  id: Generated<number>;
  user_id: number;
  account_id: number;
  category_id: number;
  payee_id: number | null;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  notes: string | null;
}
export type Transaction = Selectable<TransactionsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
export type TransactionUpdate = Updateable<TransactionsTable>;

export interface TransfersTable {
  id: Generated<number>;
  user_id: number;
  source_account_id: number;
  destination_account_id: number;
  amount: number;
  date: string;
  description: string | null;
  status: TransactionStatus;
}
export type Transfer = Selectable<TransfersTable>;
export type NewTransfer = Insertable<TransfersTable>;
export type TransferUpdate = Updateable<TransfersTable>;

export interface RecurringTransactionsTable {
  id: Generated<number>;
  user_id: number;
  account_id: number;
  category_id: number;
  payee_id: number | null;
  name: string;
  description: string | null;
  type: TransactionType;
  recurrence_type: RecurrenceType;
  amount: number;
  frequency: RecurrenceFrequency;
  due_day: number;
  start_date: string;
  end_date: string | null;
  active: 0 | 1;
}
export type RecurringTransaction = Selectable<RecurringTransactionsTable>;
export type NewRecurringTransaction = Insertable<RecurringTransactionsTable>;
export type RecurringTransactionUpdate = Updateable<RecurringTransactionsTable>;

export interface CreditCardsTable {
  id: Generated<number>;
  user_id: number;
  name: string;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  notes: string | null;
}
export type CreditCard = Selectable<CreditCardsTable>;
export type NewCreditCard = Insertable<CreditCardsTable>;
export type CreditCardUpdate = Updateable<CreditCardsTable>;

export interface CreditCardStatementsTable {
  id: Generated<number>;
  credit_card_id: number;
  start_date: string;
  end_date: string;
  due_date: string;
  status: CreditCardStatementStatus;
}
export type CreditCardStatement = Selectable<CreditCardStatementsTable>;
export type NewCreditCardStatement = Insertable<CreditCardStatementsTable>;
export type CreditCardStatementUpdate = Updateable<CreditCardStatementsTable>;

export interface CreditCardPurchasesTable {
  id: Generated<number>;
  credit_card_id: number;
  category_id: number;
  payee_id: number | null;
  description: string;
  total_amount: number;
  installment_count: number;
  purchase_date: string;
}
export type CreditCardPurchase = Selectable<CreditCardPurchasesTable>;
export type NewCreditCardPurchase = Insertable<CreditCardPurchasesTable>;
export type CreditCardPurchaseUpdate = Updateable<CreditCardPurchasesTable>;

export interface CreditCardInstallmentsTable {
  id: Generated<number>;
  credit_card_purchase_id: number;
  credit_card_statement_id: number;
  installment_number: number;
  amount: number;
  competence_date: string;
}
export type CreditCardInstallment = Selectable<CreditCardInstallmentsTable>;
export type NewCreditCardInstallment = Insertable<CreditCardInstallmentsTable>;
export type CreditCardInstallmentUpdate = Updateable<CreditCardInstallmentsTable>;

export interface CreditCardStatementPaymentsTable {
  id: Generated<number>;
  credit_card_statement_id: number;
  account_id: number;
  amount: number;
  date: string;
  transaction_id: number;
}
export type CreditCardStatementPayment = Selectable<CreditCardStatementPaymentsTable>;
export type NewCreditCardStatementPayment = Insertable<CreditCardStatementPaymentsTable>;
export type CreditCardStatementPaymentUpdate = Updateable<CreditCardStatementPaymentsTable>;

export interface Database {
  migrations: MigrationTable;
  users: UsersTable;
  user_settings: UserSettingsTable;
  account_types: AccountTypesTable;
  accounts: AccountsTable;
  category_groups: CategoryGroupsTable;
  categories: CategoriesTable;
  payees: PayeesTable;
  transactions: TransactionsTable;
  transfers: TransfersTable;
  recurring_transactions: RecurringTransactionsTable;
  credit_cards: CreditCardsTable;
  credit_card_statements: CreditCardStatementsTable;
  credit_card_purchases: CreditCardPurchasesTable;
  credit_card_installments: CreditCardInstallmentsTable;
  credit_card_statement_payments: CreditCardStatementPaymentsTable;
}
