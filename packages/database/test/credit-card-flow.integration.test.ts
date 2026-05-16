import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type {
  Database as FortunaDatabase,
  NewCreditCardPurchase,
  NewCreditCardStatement,
} from '@repo/shared';

import { createSqliteKysely } from '../src/adapters';
import { versionedMigrations } from '../src/migrations/registry';
import type { MigrationDatabase } from '../src/migrations/types';
import {
  createCreditCardsRepository,
  createCreditCardPurchasesRepository,
  createCreditCardStatementsRepository,
  createUsersRepository,
} from '../src/repositories';

const TEST_DB_PATH = join(tmpdir(), `fortuna-credit-card-${Date.now()}.db`);

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

describe('Credit card repositories flow', () => {
  it('should create purchase with installments and register statement payment with linked transaction', async () => {
    const users = createUsersRepository(db);
    const creditCards = createCreditCardsRepository(db);
    const purchases = createCreditCardPurchasesRepository(db);
    const statements = createCreditCardStatementsRepository(db);

    const user = await users.create({
      name: 'Card User',
      email: 'card.user@fortuna.local',
      password: 'hash-card',
    });

    const accountType = await db
      .insertInto('account_types')
      .values({ name: `CardAccount-${Date.now()}` })
      .returningAll()
      .executeTakeFirstOrThrow();

    const account = await db
      .insertInto('accounts')
      .values({
        user_id: user.id,
        account_type_id: accountType.id,
        name: 'Checking',
        initial_balance: 50_000,
        notes: null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const categoryGroup = await db
      .insertInto('category_groups')
      .values({ user_id: user.id, name: 'Card Category Group' })
      .returningAll()
      .executeTakeFirstOrThrow();

    const [purchaseCategory, paymentCategory] = await Promise.all([
      db
        .insertInto('categories')
        .values({
          user_id: user.id,
          category_group_id: categoryGroup.id,
          name: 'Electronics',
          type: 'expense',
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      db
        .insertInto('categories')
        .values({
          user_id: user.id,
          category_group_id: categoryGroup.id,
          name: 'Credit Card Payment',
          type: 'expense',
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
    ]);

    const card = await creditCards.create({
      user_id: user.id,
      name: 'Nubank',
      credit_limit: 300_000,
      closing_day: 25,
      due_day: 5,
      notes: null,
    });

    const statement = await statements.create({
      credit_card_id: card.id,
      start_date: '2026-01-01',
      end_date: '2026-01-31',
      due_date: '2026-02-05',
      status: 'open',
    } satisfies NewCreditCardStatement);

    const purchaseInput: NewCreditCardPurchase = {
      credit_card_id: card.id,
      category_id: purchaseCategory.id,
      payee_id: null,
      description: 'Notebook',
      total_amount: 120_000,
      installment_count: 3,
      purchase_date: '2026-01-10',
    };

    const created = await purchases.createWithInstallments(user.id, purchaseInput, [
      {
        credit_card_statement_id: statement.id,
        installment_number: 1,
        amount: 40_000,
        competence_date: '2026-01-10',
      },
      {
        credit_card_statement_id: statement.id,
        installment_number: 2,
        amount: 40_000,
        competence_date: '2026-02-10',
      },
      {
        credit_card_statement_id: statement.id,
        installment_number: 3,
        amount: 40_000,
        competence_date: '2026-03-10',
      },
    ]);

    assert.equal(created.purchase.total_amount, 120_000);
    assert.equal(created.installments.length, 3);

    const statementTotal = await statements.getStatementTotal(user.id, statement.id);
    assert.equal(statementTotal, 120_000);

    const partialPayment = await statements.registerPayment(user.id, {
      creditCardStatementId: statement.id,
      accountId: account.id,
      amount: 50_000,
      date: '2026-02-05',
      categoryId: paymentCategory.id,
      description: 'Partial payment',
      payeeId: null,
      notes: null,
      transactionStatus: 'confirmed',
    });

    assert.equal(partialPayment.statementStatus, 'open');
    assert.equal(partialPayment.statementPaidTotal, 50_000);
    assert.equal(partialPayment.transaction.type, 'expense');

    const finalPayment = await statements.registerPayment(user.id, {
      creditCardStatementId: statement.id,
      accountId: account.id,
      amount: 70_000,
      date: '2026-02-06',
      categoryId: paymentCategory.id,
      description: 'Final payment',
      payeeId: null,
      notes: null,
      transactionStatus: 'confirmed',
    });

    assert.equal(finalPayment.statementPaidTotal, 120_000);
    assert.equal(finalPayment.statementStatus, 'paid');

    const reloaded = await statements.findById(user.id, statement.id);
    assert.ok(reloaded);
    assert.equal(reloaded.status, 'paid');

    const linkedPayment = await db
      .selectFrom('credit_card_statement_payments')
      .selectAll()
      .where('id', '=', finalPayment.payment.id)
      .executeTakeFirstOrThrow();

    assert.equal(linkedPayment.transaction_id, finalPayment.transaction.id);
  });
});
