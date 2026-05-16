import type {
  NewRecurringTransaction,
  NewTransaction,
  NewTransfer,
  RecurringTransaction,
  RecurringTransactionUpdate,
  Transaction,
  TransactionUpdate,
  Transfer,
  TransferUpdate,
} from '@repo/shared';

import type { DatabaseClient } from '../../client';

const hasAffectedRows = (value: bigint | number): boolean => Number(value) > 0;

export interface TransactionsRepository {
  createTransaction(input: NewTransaction): Promise<Transaction>;
  findTransactionById(id: number): Promise<Transaction | undefined>;
  listTransactionsByUserId(userId: number): Promise<Transaction[]>;
  updateTransactionById(id: number, patch: TransactionUpdate): Promise<Transaction | undefined>;
  deleteTransactionById(id: number): Promise<boolean>;

  createTransfer(input: NewTransfer): Promise<Transfer>;
  findTransferById(id: number): Promise<Transfer | undefined>;
  listTransfersByUserId(userId: number): Promise<Transfer[]>;
  updateTransferById(id: number, patch: TransferUpdate): Promise<Transfer | undefined>;
  deleteTransferById(id: number): Promise<boolean>;

  createRecurringTransaction(input: NewRecurringTransaction): Promise<RecurringTransaction>;
  findRecurringTransactionById(id: number): Promise<RecurringTransaction | undefined>;
  listRecurringTransactionsByUserId(userId: number): Promise<RecurringTransaction[]>;
  updateRecurringTransactionById(
    id: number,
    patch: RecurringTransactionUpdate,
  ): Promise<RecurringTransaction | undefined>;
  deleteRecurringTransactionById(id: number): Promise<boolean>;
}

export const createTransactionsRepository = (
  db: DatabaseClient,
): TransactionsRepository => ({
  async createTransaction(input) {
    return db.insertInto('transactions').values(input).returningAll().executeTakeFirstOrThrow();
  },

  async findTransactionById(id) {
    return db.selectFrom('transactions').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listTransactionsByUserId(userId) {
    return db
      .selectFrom('transactions')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .execute();
  },

  async updateTransactionById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findTransactionById(id);
    }

    return db
      .updateTable('transactions')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteTransactionById(id) {
    const result = await db.deleteFrom('transactions').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createTransfer(input) {
    return db.insertInto('transfers').values(input).returningAll().executeTakeFirstOrThrow();
  },

  async findTransferById(id) {
    return db.selectFrom('transfers').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listTransfersByUserId(userId) {
    return db
      .selectFrom('transfers')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .execute();
  },

  async updateTransferById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findTransferById(id);
    }

    return db
      .updateTable('transfers')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteTransferById(id) {
    const result = await db.deleteFrom('transfers').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createRecurringTransaction(input) {
    return db
      .insertInto('recurring_transactions')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async findRecurringTransactionById(id) {
    return db
      .selectFrom('recurring_transactions')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  },

  async listRecurringTransactionsByUserId(userId) {
    return db
      .selectFrom('recurring_transactions')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('id', 'asc')
      .execute();
  },

  async updateRecurringTransactionById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findRecurringTransactionById(id);
    }

    return db
      .updateTable('recurring_transactions')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteRecurringTransactionById(id) {
    const result = await db
      .deleteFrom('recurring_transactions')
      .where('id', '=', id)
      .executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },
});
