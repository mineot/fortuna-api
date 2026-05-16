import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createSqliteKysely, reconcileMigrations } from '@repo/database';
import type { Database as FortunaDatabase } from '@repo/shared';

import { createApp } from '../src/app.js';
import { signAccessToken } from '../src/lib/jwt.js';

export interface TestContext {
  app: ReturnType<typeof createApp>;
  dbPath: string;
  userId: number;
  userEmail: string;
  userPassword: string;
  authHeader: string;
  cleanup: () => Promise<void>;
}

export interface BaseSeed {
  accountId: number;
  categoryId: number;
  payeeId: number;
}

export const setupTestContext = async (): Promise<TestContext> => {
  const tempDir = await mkdtemp(join(tmpdir(), 'fortuna-api-test-'));
  const dbPath = join(tempDir, 'test.db');

  process.env.FORTUNA_ENV = 'PROD';
  process.env.FORTUNA_DB = dbPath;
  process.env.FORTUNA_WEB_PORT = '4200';
  process.env.FORTUNA_API_PORT = '3000';
  process.env.FORTUNA_WEB_URL = 'http://localhost:4200';
  process.env.FORTUNA_API_BASE_URL = 'http://localhost:3000/api/v1';
  process.env.FORTUNA_JWT_SECRET = 'test-jwt-secret';
  process.env.FORTUNA_JWT_ACCESS_TOKEN_EXPIRES_IN = '1h';

  await reconcileMigrations({ databaseUrl: dbPath });

  const db = createSqliteKysely<FortunaDatabase>({ databaseUrl: dbPath });
  const userEmail = `test+${Date.now()}@fortuna.local`;
  const userPassword = 'test-password-hash';

  const user = await db
    .insertInto('users')
    .values({
      name: 'Test User',
      email: userEmail,
      password: userPassword,
    })
    .returning('id')
    .executeTakeFirstOrThrow();

  await db.destroy();

  const accessToken = await signAccessToken(
    { sub: String(user.id) },
    process.env.FORTUNA_JWT_SECRET,
    process.env.FORTUNA_JWT_ACCESS_TOKEN_EXPIRES_IN,
  );

  const app = createApp();

  return {
    app,
    dbPath,
    userId: user.id,
    userEmail,
    userPassword,
    authHeader: `Bearer ${accessToken}`,
    cleanup: async () => {
      await rm(tempDir, { recursive: true, force: true });
    },
  };
};

export const seedBaseFinancialData = async (
  dbPath: string,
  userId: number,
): Promise<BaseSeed> => {
  const db = createSqliteKysely<FortunaDatabase>({ databaseUrl: dbPath });

  try {
    const accountType = await db
      .insertInto('account_types')
      .values({ name: 'Checking' })
      .returning('id')
      .executeTakeFirstOrThrow();

    const account = await db
      .insertInto('accounts')
      .values({
        user_id: userId,
        account_type_id: accountType.id,
        name: 'Main Account',
        initial_balance: 0,
        notes: null,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const categoryGroup = await db
      .insertInto('category_groups')
      .values({
        user_id: userId,
        name: 'General',
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const category = await db
      .insertInto('categories')
      .values({
        user_id: userId,
        category_group_id: categoryGroup.id,
        name: 'General Expense',
        type: 'expense',
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const payee = await db
      .insertInto('payees')
      .values({
        user_id: userId,
        name: 'Test Payee',
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    return {
      accountId: account.id,
      categoryId: category.id,
      payeeId: payee.id,
    };
  } finally {
    await db.destroy();
  }
};

export const seedCreditCardStatementScenario = async (dbPath: string, userId: number) => {
  const base = await seedBaseFinancialData(dbPath, userId);
  const db = createSqliteKysely<FortunaDatabase>({ databaseUrl: dbPath });

  try {
    const creditCard = await db
      .insertInto('credit_cards')
      .values({
        user_id: userId,
        name: 'Primary Card',
        credit_limit: 100000,
        closing_day: 10,
        due_day: 20,
        notes: null,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const statement = await db
      .insertInto('credit_card_statements')
      .values({
        credit_card_id: creditCard.id,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        due_date: '2026-02-10',
        status: 'open',
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const purchase = await db
      .insertInto('credit_card_purchases')
      .values({
        credit_card_id: creditCard.id,
        category_id: base.categoryId,
        payee_id: base.payeeId,
        description: 'Test Purchase',
        total_amount: 5000,
        installment_count: 1,
        purchase_date: '2026-01-10',
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    await db.insertInto('credit_card_installments').values({
      credit_card_purchase_id: purchase.id,
      credit_card_statement_id: statement.id,
      installment_number: 1,
      amount: 5000,
      competence_date: '2026-01-10',
    }).execute();

    return {
      ...base,
      creditCardId: creditCard.id,
      statementId: statement.id,
    };
  } finally {
    await db.destroy();
  }
};
