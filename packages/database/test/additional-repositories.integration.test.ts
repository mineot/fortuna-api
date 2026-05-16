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
  createAccountTypesRepository,
  createCategoryGroupsRepository,
  createCreditCardsRepository,
  createCreditCardStatementPaymentsRepository,
  createCreditCardStatementsRepository,
  createPayeesRepository,
  createRecurringTransactionsRepository,
  createUsersRepository,
} from '../src/repositories';

const TEST_DB_PATH = join(tmpdir(), `fortuna-additional-repos-${Date.now()}.db`);

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

describe('Additional repositories', () => {
  it('account types repository should support CRUD/list', async () => {
    const repo = createAccountTypesRepository(db);

    const created = await repo.create({ name: `Type-${Date.now()}` });
    const listed = await repo.list();
    assert.ok(listed.some((item) => item.id === created.id));

    const updated = await repo.updateById(created.id, { name: `${created.name}-Updated` });
    assert.ok(updated);
    assert.equal(updated.name, `${created.name}-Updated`);

    const removed = await repo.deleteById(created.id);
    assert.equal(removed, true);
  });

  it('category groups, payees and recurring repositories should isolate by user', async () => {
    const users = createUsersRepository(db);
    const accountTypes = createAccountTypesRepository(db);
    const categoryGroups = createCategoryGroupsRepository(db);
    const payees = createPayeesRepository(db);
    const recurring = createRecurringTransactionsRepository(db);

    const [userA, userB] = await Promise.all([
      users.create({ name: 'A', email: 'a.additional@fortuna.local', password: 'hash-a' }),
      users.create({ name: 'B', email: 'b.additional@fortuna.local', password: 'hash-b' }),
    ]);

    const accountType = await accountTypes.create({ name: `RecurringType-${Date.now()}` });

    const accountA = await db
      .insertInto('accounts')
      .values({
        user_id: userA.id,
        account_type_id: accountType.id,
        name: 'A account',
        initial_balance: 0,
        notes: null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const groupA = await categoryGroups.create({ user_id: userA.id, name: 'Group A' });
    const groupB = await categoryGroups.create({ user_id: userB.id, name: 'Group B' });

    const categoryA = await db
      .insertInto('categories')
      .values({
        user_id: userA.id,
        category_group_id: groupA.id,
        name: 'Category A',
        type: 'expense',
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const payeeA = await payees.create({ user_id: userA.id, name: 'Netflix' });
    await payees.create({ user_id: userB.id, name: 'Other user payee' });

    const recurringA = await recurring.create({
      user_id: userA.id,
      account_id: accountA.id,
      category_id: categoryA.id,
      payee_id: payeeA.id,
      name: 'Netflix monthly',
      description: null,
      type: 'expense',
      recurrence_type: 'subscription',
      amount: 3990,
      frequency: 'monthly',
      due_day: 10,
      start_date: '2026-01-01',
      end_date: null,
      active: 1,
    });

    const groupsOfA = await categoryGroups.listByUser(userA.id);
    assert.equal(groupsOfA.length, 1);
    assert.equal(groupsOfA[0].id, groupA.id);

    const payeesOfA = await payees.listByUser(userA.id, { search: 'Net' });
    assert.equal(payeesOfA.length, 1);
    assert.equal(payeesOfA[0].id, payeeA.id);

    const recurringOfA = await recurring.listByUser(userA.id, { active: 1 });
    assert.equal(recurringOfA.length, 1);
    assert.equal(recurringOfA[0].id, recurringA.id);

    const crossUserRead = await categoryGroups.findById(userA.id, groupB.id);
    assert.equal(crossUserRead, undefined);
  });

  it('credit card statement payments repository should list and find by ownership', async () => {
    const users = createUsersRepository(db);
    const cards = createCreditCardsRepository(db);
    const statements = createCreditCardStatementsRepository(db);
    const paymentsRepo = createCreditCardStatementPaymentsRepository(db);

    const user = await users.create({
      name: 'Payment User',
      email: 'payment.user@fortuna.local',
      password: 'hash-payment',
    });

    const accountType = await db
      .insertInto('account_types')
      .values({ name: `PaymentType-${Date.now()}` })
      .returningAll()
      .executeTakeFirstOrThrow();

    const account = await db
      .insertInto('accounts')
      .values({
        user_id: user.id,
        account_type_id: accountType.id,
        name: 'Pay account',
        initial_balance: 100_000,
        notes: null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const categoryGroup = await db
      .insertInto('category_groups')
      .values({ user_id: user.id, name: 'Payment Group' })
      .returningAll()
      .executeTakeFirstOrThrow();

    const paymentCategory = await db
      .insertInto('categories')
      .values({
        user_id: user.id,
        category_group_id: categoryGroup.id,
        name: 'Credit Card Payment',
        type: 'expense',
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const card = await cards.create({
      user_id: user.id,
      name: 'Card',
      credit_limit: 200_000,
      closing_day: 20,
      due_day: 5,
      notes: null,
    });

    const statement = await statements.create({
      credit_card_id: card.id,
      start_date: '2026-03-01',
      end_date: '2026-03-31',
      due_date: '2026-04-05',
      status: 'open',
    });

    await db
      .insertInto('credit_card_installments')
      .values({
        credit_card_purchase_id: (
          await db
            .insertInto('credit_card_purchases')
            .values({
              credit_card_id: card.id,
              category_id: paymentCategory.id,
              payee_id: null,
              description: 'Any purchase',
              total_amount: 20_000,
              installment_count: 1,
              purchase_date: '2026-03-15',
            })
            .returning('id')
            .executeTakeFirstOrThrow()
        ).id,
        credit_card_statement_id: statement.id,
        installment_number: 1,
        amount: 20_000,
        competence_date: '2026-03-15',
      })
      .execute();

    const paymentResult = await statements.registerPayment(user.id, {
      creditCardStatementId: statement.id,
      accountId: account.id,
      amount: 20_000,
      date: '2026-04-01',
      categoryId: paymentCategory.id,
      description: 'Payment',
      payeeId: null,
      notes: null,
      transactionStatus: 'confirmed',
    });

    const listed = await paymentsRepo.listByStatement(user.id, statement.id);
    assert.equal(listed.length, 1);
    assert.equal(listed[0].id, paymentResult.payment.id);

    const found = await paymentsRepo.findById(user.id, paymentResult.payment.id);
    assert.ok(found);
    assert.equal(found.transaction_id, paymentResult.transaction.id);
  });
});
