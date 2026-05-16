import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { Database as FortunaDatabase, NewAccount, NewCategory, NewTransfer, NewTransaction } from '@repo/shared';

import { createSqliteKysely } from '../src/adapters';
import { versionedMigrations } from '../src/migrations/registry';
import type { MigrationDatabase } from '../src/migrations/types';
import {
  createAccountsRepository,
  createCategoriesRepository,
  createTransactionsRepository,
  createTransfersRepository,
  createUsersRepository,
} from '../src/repositories';

const TEST_DB_PATH = join(tmpdir(), `fortuna-repositories-${Date.now()}.db`);

let db: ReturnType<typeof createSqliteKysely<FortunaDatabase>>;

before(async () => {
  const migrationDb = createSqliteKysely<MigrationDatabase>({ databaseUrl: TEST_DB_PATH });

  try {
    await versionedMigrations[0].up(migrationDb);
  } finally {
    await migrationDb.destroy();
  }

  db = createSqliteKysely<FortunaDatabase>({ databaseUrl: TEST_DB_PATH });
});

after(async () => {
  await db.destroy();
  rmSync(TEST_DB_PATH, { force: true });
});

describe('Base repositories', () => {
  it('users repository should support create/read/update/delete', async () => {
    const users = createUsersRepository(db);

    const created = await users.create({
      name: 'Alice',
      email: 'alice.repo@fortuna.local',
      password: 'hash-1',
    });

    const byId = await users.findById(created.id);
    assert.ok(byId);
    assert.equal(byId.email, 'alice.repo@fortuna.local');

    const byEmail = await users.findByEmail('alice.repo@fortuna.local');
    assert.ok(byEmail);
    assert.equal(byEmail.id, created.id);

    const updated = await users.updateById(created.id, { name: 'Alice Updated' });
    assert.ok(updated);
    assert.equal(updated.name, 'Alice Updated');

    const deleted = await users.deleteById(created.id);
    assert.equal(deleted, true);

    const missing = await users.findById(created.id);
    assert.equal(missing, undefined);
  });

  it('repositories should isolate records by user_id', async () => {
    const users = createUsersRepository(db);
    const categories = createCategoriesRepository(db);

    const userA = await users.create({
      name: 'User A',
      email: 'user.a.repo@fortuna.local',
      password: 'hash-a',
    });

    const userB = await users.create({
      name: 'User B',
      email: 'user.b.repo@fortuna.local',
      password: 'hash-b',
    });

    const [groupA, groupB] = await Promise.all([
      db
        .insertInto('category_groups')
        .values({ user_id: userA.id, name: 'Group A' })
        .returningAll()
        .executeTakeFirstOrThrow(),
      db
        .insertInto('category_groups')
        .values({ user_id: userB.id, name: 'Group B' })
        .returningAll()
        .executeTakeFirstOrThrow(),
    ]);

    const categoryAInput: NewCategory = {
      user_id: userA.id,
      category_group_id: groupA.id,
      name: 'Food A',
      type: 'expense',
    };

    const categoryBInput: NewCategory = {
      user_id: userB.id,
      category_group_id: groupB.id,
      name: 'Food B',
      type: 'expense',
    };

    await Promise.all([categories.create(categoryAInput), categories.create(categoryBInput)]);

    const listA = await categories.listByUser(userA.id);
    const listB = await categories.listByUser(userB.id);

    assert.equal(listA.length, 1);
    assert.equal(listB.length, 1);
    assert.equal(listA[0].user_id, userA.id);
    assert.equal(listB[0].user_id, userB.id);
  });

  it('accounts repository should calculate current balance using confirmed transactions and transfers', async () => {
    const users = createUsersRepository(db);
    const accounts = createAccountsRepository(db);
    const transactions = createTransactionsRepository(db);
    const transfers = createTransfersRepository(db);

    const user = await users.create({
      name: 'Balance User',
      email: 'balance.repo@fortuna.local',
      password: 'hash-balance',
    });

    const accountType = await db
      .insertInto('account_types')
      .values({ name: `Checking-${Date.now()}` })
      .returningAll()
      .executeTakeFirstOrThrow();

    const [mainAccount, otherAccount] = await Promise.all([
      accounts.create({
        user_id: user.id,
        account_type_id: accountType.id,
        name: 'Main',
        initial_balance: 10_000,
        notes: null,
      } satisfies NewAccount),
      accounts.create({
        user_id: user.id,
        account_type_id: accountType.id,
        name: 'Other',
        initial_balance: 0,
        notes: null,
      } satisfies NewAccount),
    ]);

    const categoryGroup = await db
      .insertInto('category_groups')
      .values({ user_id: user.id, name: 'Balance Group' })
      .returningAll()
      .executeTakeFirstOrThrow();

    const [incomeCategory, expenseCategory] = await Promise.all([
      db
        .insertInto('categories')
        .values({
          user_id: user.id,
          category_group_id: categoryGroup.id,
          name: 'Salary',
          type: 'income',
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      db
        .insertInto('categories')
        .values({
          user_id: user.id,
          category_group_id: categoryGroup.id,
          name: 'Food',
          type: 'expense',
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
    ]);

    await transactions.create({
      user_id: user.id,
      account_id: mainAccount.id,
      category_id: incomeCategory.id,
      payee_id: null,
      type: 'income',
      description: 'Confirmed income',
      amount: 5_000,
      date: '2026-01-01',
      status: 'confirmed',
      notes: null,
    } satisfies NewTransaction);

    await transactions.create({
      user_id: user.id,
      account_id: mainAccount.id,
      category_id: expenseCategory.id,
      payee_id: null,
      type: 'expense',
      description: 'Confirmed expense',
      amount: 1_500,
      date: '2026-01-02',
      status: 'confirmed',
      notes: null,
    } satisfies NewTransaction);

    await transactions.create({
      user_id: user.id,
      account_id: mainAccount.id,
      category_id: incomeCategory.id,
      payee_id: null,
      type: 'income',
      description: 'Pending income',
      amount: 999_999,
      date: '2026-01-03',
      status: 'pending',
      notes: null,
    } satisfies NewTransaction);

    await transfers.create({
      user_id: user.id,
      source_account_id: mainAccount.id,
      destination_account_id: otherAccount.id,
      amount: 700,
      date: '2026-01-04',
      description: 'Outgoing confirmed transfer',
      status: 'confirmed',
    } satisfies NewTransfer);

    await transfers.create({
      user_id: user.id,
      source_account_id: otherAccount.id,
      destination_account_id: mainAccount.id,
      amount: 200,
      date: '2026-01-05',
      description: 'Incoming confirmed transfer',
      status: 'confirmed',
    } satisfies NewTransfer);

    await transfers.create({
      user_id: user.id,
      source_account_id: otherAccount.id,
      destination_account_id: mainAccount.id,
      amount: 999_999,
      date: '2026-01-06',
      description: 'Incoming pending transfer',
      status: 'pending',
    } satisfies NewTransfer);

    const currentBalance = await accounts.getCurrentBalance(user.id, mainAccount.id);

    // 10000 + 5000 - 1500 + 200 - 700 = 13000
    assert.equal(currentBalance, 13_000);
  });
});
