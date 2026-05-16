import type {
  Account,
  AccountType,
  AccountTypeUpdate,
  AccountUpdate,
  NewAccount,
  NewAccountType,
} from '@repo/shared';

import type { DatabaseClient } from '../../client';

const hasAffectedRows = (value: bigint | number): boolean => Number(value) > 0;

export interface AccountsRepository {
  createAccount(input: NewAccount): Promise<Account>;
  findAccountById(id: number): Promise<Account | undefined>;
  listAccountsByUserId(userId: number): Promise<Account[]>;
  updateAccountById(id: number, patch: AccountUpdate): Promise<Account | undefined>;
  deleteAccountById(id: number): Promise<boolean>;

  createAccountType(input: NewAccountType): Promise<AccountType>;
  findAccountTypeById(id: number): Promise<AccountType | undefined>;
  listAccountTypes(): Promise<AccountType[]>;
  updateAccountTypeById(id: number, patch: AccountTypeUpdate): Promise<AccountType | undefined>;
  deleteAccountTypeById(id: number): Promise<boolean>;
}

export const createAccountsRepository = (db: DatabaseClient): AccountsRepository => ({
  async createAccount(input) {
    return db.insertInto('accounts').values(input).returningAll().executeTakeFirstOrThrow();
  },

  async findAccountById(id) {
    return db.selectFrom('accounts').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listAccountsByUserId(userId) {
    return db
      .selectFrom('accounts')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('id', 'asc')
      .execute();
  },

  async updateAccountById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findAccountById(id);
    }

    return db
      .updateTable('accounts')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteAccountById(id) {
    const result = await db.deleteFrom('accounts').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createAccountType(input) {
    return db.insertInto('account_types').values(input).returningAll().executeTakeFirstOrThrow();
  },

  async findAccountTypeById(id) {
    return db.selectFrom('account_types').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listAccountTypes() {
    return db.selectFrom('account_types').selectAll().orderBy('id', 'asc').execute();
  },

  async updateAccountTypeById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findAccountTypeById(id);
    }

    return db
      .updateTable('account_types')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteAccountTypeById(id) {
    const result = await db.deleteFrom('account_types').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },
});
