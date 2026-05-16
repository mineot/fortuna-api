export * from './users';
export * from './accounts';
export * from './categories';
export * from './transactions';
export * from './credit-cards';

import type { DatabaseClient } from '../client';

import { createAccountsRepository } from './accounts';
import { createCategoriesRepository } from './categories';
import { createCreditCardsRepository } from './credit-cards';
import { createTransactionsRepository } from './transactions';
import { createUsersRepository } from './users';

export interface DatabaseRepositories {
  users: ReturnType<typeof createUsersRepository>;
  accounts: ReturnType<typeof createAccountsRepository>;
  categories: ReturnType<typeof createCategoriesRepository>;
  transactions: ReturnType<typeof createTransactionsRepository>;
  creditCards: ReturnType<typeof createCreditCardsRepository>;
}

export const createRepositories = (db: DatabaseClient): DatabaseRepositories => ({
  users: createUsersRepository(db),
  accounts: createAccountsRepository(db),
  categories: createCategoriesRepository(db),
  transactions: createTransactionsRepository(db),
  creditCards: createCreditCardsRepository(db),
});
