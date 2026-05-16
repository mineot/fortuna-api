import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { Database as FortunaDatabase } from '@repo/shared';

import { createSqliteKysely } from '../src/adapters';
import { versionedMigrations } from '../src/migrations/registry';
import type { MigrationDatabase } from '../src/migrations/types';
import {
  createCreditCardsRepository,
  createCreditCardStatementsRepository,
  createReportsRepository,
  createUserSettingsRepository,
  createUsersRepository,
} from '../src/repositories';

const TEST_DB_PATH = join(tmpdir(), `fortuna-user-settings-reports-${Date.now()}.db`);

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

describe('User settings and reports repositories', () => {
  it('user settings repository should upsert and delete by user_id', async () => {
    const users = createUsersRepository(db);
    const settings = createUserSettingsRepository(db);

    const user = await users.create({
      name: 'Settings User',
      email: 'settings.user@fortuna.local',
      password: 'hash-settings',
    });

    const first = await settings.upsertByUserId(user.id, {
      locale: 'pt-BR',
      currency: 'BRL',
      fiscal_year_cutoff_day: 25,
      fiscal_year_cutoff_month: 12,
    });

    assert.equal(first.locale, 'pt-BR');

    const second = await settings.upsertByUserId(user.id, {
      locale: 'en-US',
      currency: 'USD',
      fiscal_year_cutoff_day: 31,
      fiscal_year_cutoff_month: 1,
    });

    assert.equal(second.locale, 'en-US');
    assert.equal(second.currency, 'USD');

    const deleted = await settings.deleteByUserId(user.id);
    assert.equal(deleted, true);

    const missing = await settings.findByUserId(user.id);
    assert.equal(missing, undefined);
  });

  it('reports repository should return finance summary, balances and statement balance', async () => {
    const users = createUsersRepository(db);
    const cards = createCreditCardsRepository(db);
    const statements = createCreditCardStatementsRepository(db);
    const reports = createReportsRepository(db);

    const user = await users.create({
      name: 'Reports User',
      email: 'reports.user@fortuna.local',
      password: 'hash-reports',
    });

    const accountType = await db
      .insertInto('account_types')
      .values({ name: `ReportType-${Date.now()}` })
      .returningAll()
      .executeTakeFirstOrThrow();

    const account = await db
      .insertInto('accounts')
      .values({
        user_id: user.id,
        account_type_id: accountType.id,
        name: 'Main account',
        initial_balance: 10_000,
        notes: null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const otherAccount = await db
      .insertInto('accounts')
      .values({
        user_id: user.id,
        account_type_id: accountType.id,
        name: 'Other account',
        initial_balance: 0,
        notes: null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const group = await db
      .insertInto('category_groups')
      .values({ user_id: user.id, name: 'Report Group' })
      .returningAll()
      .executeTakeFirstOrThrow();

    const [incomeCategory, expenseCategory, paymentCategory] = await Promise.all([
      db
        .insertInto('categories')
        .values({
          user_id: user.id,
          category_group_id: group.id,
          name: 'Salary',
          type: 'income',
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      db
        .insertInto('categories')
        .values({
          user_id: user.id,
          category_group_id: group.id,
          name: 'Food',
          type: 'expense',
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      db
        .insertInto('categories')
        .values({
          user_id: user.id,
          category_group_id: group.id,
          name: 'Credit Card Payment',
          type: 'expense',
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
    ]);

    await db.insertInto('transactions').values([
      {
        user_id: user.id,
        account_id: account.id,
        category_id: incomeCategory.id,
        payee_id: null,
        type: 'income',
        description: 'Salary',
        amount: 5_000,
        date: '2026-04-01',
        status: 'confirmed',
        notes: null,
      },
      {
        user_id: user.id,
        account_id: account.id,
        category_id: expenseCategory.id,
        payee_id: null,
        type: 'expense',
        description: 'Food',
        amount: 1_000,
        date: '2026-04-02',
        status: 'confirmed',
        notes: null,
      },
    ]).execute();

    await db.insertInto('transfers').values([
      {
        user_id: user.id,
        source_account_id: account.id,
        destination_account_id: otherAccount.id,
        amount: 300,
        date: '2026-04-03',
        description: 'transfer out',
        status: 'confirmed',
      },
      {
        user_id: user.id,
        source_account_id: otherAccount.id,
        destination_account_id: account.id,
        amount: 100,
        date: '2026-04-04',
        description: 'transfer in',
        status: 'confirmed',
      },
    ]).execute();

    const card = await cards.create({
      user_id: user.id,
      name: 'Reports Card',
      credit_limit: 100_000,
      closing_day: 20,
      due_day: 5,
      notes: null,
    });

    const statement = await statements.create({
      credit_card_id: card.id,
      start_date: '2026-04-01',
      end_date: '2026-04-30',
      due_date: '2026-05-05',
      status: 'open',
    });

    const purchase = await db
      .insertInto('credit_card_purchases')
      .values({
        credit_card_id: card.id,
        category_id: expenseCategory.id,
        payee_id: null,
        description: 'Phone',
        total_amount: 20_000,
        installment_count: 1,
        purchase_date: '2026-04-10',
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await db
      .insertInto('credit_card_installments')
      .values({
        credit_card_purchase_id: purchase.id,
        credit_card_statement_id: statement.id,
        installment_number: 1,
        amount: 20_000,
        competence_date: '2026-04-10',
      })
      .execute();

    await statements.registerPayment(user.id, {
      creditCardStatementId: statement.id,
      accountId: account.id,
      amount: 20_000,
      date: '2026-05-01',
      categoryId: paymentCategory.id,
      description: 'statement payment',
      payeeId: null,
      notes: null,
      transactionStatus: 'confirmed',
    });

    const summary = await reports.getUserFinanceSummary(user.id, {
      dateFrom: '2026-04-01',
      dateTo: '2026-05-31',
    });

    assert.equal(summary.incomeTotal, 5_000);
    assert.equal(summary.expenseTotal, 21_000);
    assert.equal(summary.netFlow, -16_000);

    const balances = await reports.getAccountBalancesByUser(user.id);
    const mainBalance = balances.find((item) => item.accountId === account.id);
    assert.ok(mainBalance);
    // 10000 + 5000 - (1000 + 20000) + 100 - 300 = -6200
    assert.equal(mainBalance.currentBalance, -6_200);

    const statementBalance = await reports.getStatementBalance(user.id, statement.id);
    assert.ok(statementBalance);
    assert.equal(statementBalance.statementTotal, 20_000);
    assert.equal(statementBalance.paidTotal, 20_000);
    assert.equal(statementBalance.remainingAmount, 0);
  });
});
