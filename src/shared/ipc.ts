import type {
  Account,
  AccountType,
  Category,
  CategoryGroup,
  CreditCard,
  CreditCardInstallment,
  CreditCardPurchase,
  CreditCardStatement,
  CreditCardStatementPayment,
  NewAccount,
  NewAccountType,
  NewCategory,
  NewCategoryGroup,
  NewCreditCard,
  NewCreditCardInstallment,
  NewCreditCardPurchase,
  NewCreditCardStatement,
  NewCreditCardStatementPayment,
  NewPayee,
  NewRecurringTransaction,
  NewTransaction,
  NewTransfer,
  NewUser,
  NewUserSettings,
  Payee,
  RecurringTransaction,
  Transaction,
  Transfer,
  User,
  UserSettings,
} from '../database/schema';
import type { GetLocaleResponse, GetMetaResponse } from './handlers/app/app.types';

export interface CrudApi<Row, AddInput, ChangeInput> {
  list: (input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) => Promise<{
    items: Row[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startItem: number;
    endItem: number;
  }>;
  findOne: (id: number) => Promise<Row | undefined>;
  add: (input: AddInput) => Promise<Row>;
  change: (input: { id: number; changes: ChangeInput }) => Promise<Row | undefined>;
  remove: (id: number) => Promise<boolean>;
}

export interface RendererApi {
  appGetMeta: () => Promise<GetMetaResponse>;
  appGetLocale: () => Promise<GetLocaleResponse>;
  users: CrudApi<User, NewUser, Partial<NewUser>>;
  userSettings: CrudApi<UserSettings, NewUserSettings, Partial<NewUserSettings>>;
  accountTypes: CrudApi<AccountType, NewAccountType, Partial<NewAccountType>>;
  accounts: CrudApi<Account, NewAccount, Partial<NewAccount>>;
  categoryGroups: CrudApi<CategoryGroup, NewCategoryGroup, Partial<NewCategoryGroup>>;
  categories: CrudApi<Category, NewCategory, Partial<NewCategory>>;
  payees: CrudApi<Payee, NewPayee, Partial<NewPayee>>;
  transactions: CrudApi<Transaction, NewTransaction, Partial<NewTransaction>>;
  transfers: CrudApi<Transfer, NewTransfer, Partial<NewTransfer>>;
  recurringTransactions: CrudApi<RecurringTransaction, NewRecurringTransaction, Partial<NewRecurringTransaction>>;
  creditCards: CrudApi<CreditCard, NewCreditCard, Partial<NewCreditCard>>;
  creditCardStatements: CrudApi<CreditCardStatement, NewCreditCardStatement, Partial<NewCreditCardStatement>>;
  creditCardPurchases: CrudApi<CreditCardPurchase, NewCreditCardPurchase, Partial<NewCreditCardPurchase>>;
  creditCardInstallments: CrudApi<CreditCardInstallment, NewCreditCardInstallment, Partial<NewCreditCardInstallment>>;
  creditCardStatementPayments: CrudApi<
    CreditCardStatementPayment,
    NewCreditCardStatementPayment,
    Partial<NewCreditCardStatementPayment>
  >;
}
