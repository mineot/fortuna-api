import {
  createAccountTypesRepository,
  createAccountsRepository,
  createCategoriesRepository,
  createCategoryGroupsRepository,
  createCreditCardInstallmentsRepository,
  createCreditCardPurchasesRepository,
  createCreditCardStatementPaymentsRepository,
  createCreditCardStatementsRepository,
  createCreditCardsRepository,
  createPayeesRepository,
  createRecurringTransactionsRepository,
  createReportsRepository,
  createSqliteKysely,
  createTransactionsRepository,
  createTransfersRepository,
  createUserSettingsRepository,
  createUsersRepository,
} from '@repo/database';

export const createApiDatabase = () => createSqliteKysely();

export const createApiRepositories = () => {
  const db = createApiDatabase();

  return {
    db,
    users: createUsersRepository(db),
    userSettings: createUserSettingsRepository(db),
    accountTypes: createAccountTypesRepository(db),
    accounts: createAccountsRepository(db),
    categoryGroups: createCategoryGroupsRepository(db),
    categories: createCategoriesRepository(db),
    payees: createPayeesRepository(db),
    transactions: createTransactionsRepository(db),
    transfers: createTransfersRepository(db),
    recurringTransactions: createRecurringTransactionsRepository(db),
    creditCards: createCreditCardsRepository(db),
    creditCardStatements: createCreditCardStatementsRepository(db),
    creditCardPurchases: createCreditCardPurchasesRepository(db),
    creditCardInstallments: createCreditCardInstallmentsRepository(db),
    creditCardStatementPayments: createCreditCardStatementPaymentsRepository(db),
    reports: createReportsRepository(db),
  };
};

export type ApiRepositories = ReturnType<typeof createApiRepositories>;
