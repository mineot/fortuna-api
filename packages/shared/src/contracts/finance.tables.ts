import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

import type {
  BooleanInt,
  CreditCardStatementStatus,
  IsoDate,
  MoneyCents,
  RecurrenceFrequency,
  RecurrenceType,
  TransactionStatus,
  TransactionType,
} from '../types/finance.types';

export interface BaseTable {
  id: Generated<number>;
}

export interface UsersTable extends BaseTable {
  name: string;
  email: string;
  password: string;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export interface UserSettingsTable extends BaseTable {
  user_id: number;
  locale: string;
  currency: string;
  fiscal_year_cutoff_day: number;
  fiscal_year_cutoff_month: number;
}

export type UserSettings = Selectable<UserSettingsTable>;
export type NewUserSettings = Insertable<UserSettingsTable>;
export type UserSettingsUpdate = Updateable<UserSettingsTable>;

export interface AccountTypesTable extends BaseTable {
  name: string;
}

export type AccountType = Selectable<AccountTypesTable>;
export type NewAccountType = Insertable<AccountTypesTable>;
export type AccountTypeUpdate = Updateable<AccountTypesTable>;

export interface AccountsTable extends BaseTable {
  user_id: number;
  account_type_id: number;
  name: string;
  initial_balance: MoneyCents;
  notes: string | null;
}

export type Account = Selectable<AccountsTable>;
export type NewAccount = Insertable<AccountsTable>;
export type AccountUpdate = Updateable<AccountsTable>;

export interface CategoryGroupsTable extends BaseTable {
  user_id: number;
  name: string;
}

export type CategoryGroup = Selectable<CategoryGroupsTable>;
export type NewCategoryGroup = Insertable<CategoryGroupsTable>;
export type CategoryGroupUpdate = Updateable<CategoryGroupsTable>;

export interface CategoriesTable extends BaseTable {
  user_id: number;
  category_group_id: number;
  name: string;
  type: TransactionType;
}

export type Category = Selectable<CategoriesTable>;
export type NewCategory = Insertable<CategoriesTable>;
export type CategoryUpdate = Updateable<CategoriesTable>;

export interface PayeesTable extends BaseTable {
  user_id: number;
  name: string;
}

export type Payee = Selectable<PayeesTable>;
export type NewPayee = Insertable<PayeesTable>;
export type PayeeUpdate = Updateable<PayeesTable>;

export interface TransactionsTable extends BaseTable {
  user_id: number;
  account_id: number;
  category_id: number;
  payee_id: number | null;
  type: TransactionType;
  description: string;
  amount: MoneyCents;
  date: IsoDate;
  status: TransactionStatus;
  notes: string | null;
}

export type Transaction = Selectable<TransactionsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
export type TransactionUpdate = Updateable<TransactionsTable>;

export interface TransfersTable extends BaseTable {
  user_id: number;
  source_account_id: number;
  destination_account_id: number;
  amount: MoneyCents;
  date: IsoDate;
  description: string | null;
  status: TransactionStatus;
}

export type Transfer = Selectable<TransfersTable>;
export type NewTransfer = Insertable<TransfersTable>;
export type TransferUpdate = Updateable<TransfersTable>;

export interface RecurringTransactionsTable extends BaseTable {
  user_id: number;
  account_id: number;
  category_id: number;
  payee_id: number | null;
  name: string;
  description: string | null;
  type: TransactionType;
  recurrence_type: RecurrenceType;
  amount: MoneyCents;
  frequency: RecurrenceFrequency;
  due_day: number;
  start_date: IsoDate;
  end_date: IsoDate | null;
  active: BooleanInt;
}

export type RecurringTransaction = Selectable<RecurringTransactionsTable>;
export type NewRecurringTransaction = Insertable<RecurringTransactionsTable>;
export type RecurringTransactionUpdate = Updateable<RecurringTransactionsTable>;

export interface CreditCardsTable extends BaseTable {
  user_id: number;
  name: string;
  credit_limit: MoneyCents;
  closing_day: number;
  due_day: number;
  notes: string | null;
}

export type CreditCard = Selectable<CreditCardsTable>;
export type NewCreditCard = Insertable<CreditCardsTable>;
export type CreditCardUpdate = Updateable<CreditCardsTable>;

export interface CreditCardStatementsTable extends BaseTable {
  credit_card_id: number;
  start_date: IsoDate;
  end_date: IsoDate;
  due_date: IsoDate;
  status: CreditCardStatementStatus;
}

export type CreditCardStatement = Selectable<CreditCardStatementsTable>;
export type NewCreditCardStatement = Insertable<CreditCardStatementsTable>;
export type CreditCardStatementUpdate = Updateable<CreditCardStatementsTable>;

export interface CreditCardPurchasesTable extends BaseTable {
  credit_card_id: number;
  category_id: number;
  payee_id: number | null;
  description: string;
  total_amount: MoneyCents;
  installment_count: number;
  purchase_date: IsoDate;
}

export type CreditCardPurchase = Selectable<CreditCardPurchasesTable>;
export type NewCreditCardPurchase = Insertable<CreditCardPurchasesTable>;
export type CreditCardPurchaseUpdate = Updateable<CreditCardPurchasesTable>;

export interface CreditCardInstallmentsTable extends BaseTable {
  credit_card_purchase_id: number;
  credit_card_statement_id: number;
  installment_number: number;
  amount: MoneyCents;
  competence_date: IsoDate;
}

export type CreditCardInstallment = Selectable<CreditCardInstallmentsTable>;
export type NewCreditCardInstallment = Insertable<CreditCardInstallmentsTable>;
export type CreditCardInstallmentUpdate = Updateable<CreditCardInstallmentsTable>;

export interface CreditCardStatementPaymentsTable extends BaseTable {
  credit_card_statement_id: number;
  account_id: number;
  amount: MoneyCents;
  date: IsoDate;
  transaction_id: number;
}

export type CreditCardStatementPayment = Selectable<CreditCardStatementPaymentsTable>;
export type NewCreditCardStatementPayment = Insertable<CreditCardStatementPaymentsTable>;
export type CreditCardStatementPaymentUpdate = Updateable<CreditCardStatementPaymentsTable>;

export interface Database {
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
