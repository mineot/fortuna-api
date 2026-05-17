import { strict as assert } from 'node:assert';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { runCli } from '../src/runtime/run-cli.js';

type DatabaseModule = {
  reconcileMigrations: (options?: { databaseUrl?: string }) => Promise<unknown>;
  createSqliteKysely: (options?: { databaseUrl?: string }) => {
    insertInto: (table: string) => {
      values: (value: Record<string, unknown>) => {
        execute: () => Promise<unknown>;
      };
    };
    destroy: () => Promise<void>;
  };
};

async function loadDatabaseModule(): Promise<DatabaseModule> {
  const modulePath = '../../../packages/database/dist/index.js';
  return import(modulePath) as unknown as Promise<DatabaseModule>;
}

async function setupLocalIntegrationDb() {
  const dir = await mkdtemp(join(tmpdir(), 'fortuna-cli-int-'));
  const dbPath = join(dir, 'integration.db');

  process.env.FORTUNA_ENV = 'PROD';
  process.env.FORTUNA_DB = dbPath;

  const dbModule = await loadDatabaseModule();
  await dbModule.reconcileMigrations({ databaseUrl: dbPath });

  const db = dbModule.createSqliteKysely({ databaseUrl: dbPath });
  await db.insertInto('users').values({
    id: 1,
    name: 'Integration User',
    email: 'integration.user@fortuna.local',
    password: 'integration-password'
  }).execute();

  await db.insertInto('account_types').values({ id: 1, name: 'Checking' }).execute();
  await db.insertInto('category_groups').values({ id: 1, user_id: 1, name: 'Expenses' }).execute();
  await db.insertInto('categories').values({
    id: 1,
    user_id: 1,
    category_group_id: 1,
    name: 'Food',
    type: 'expense'
  }).execute();
  await db.destroy();

  const cleanup = async () => {
    await rm(dir, { recursive: true, force: true });
  };

  return { cleanup };
}

function parseOutput<T>(output: string): T {
  return JSON.parse(output) as T;
}

test('local integration: accounts/categories/transactions/transfers/reports flow', async () => {
  const { cleanup } = await setupLocalIntegrationDb();

  try {
    const accountCreate = await runCli({
      argv: [
        '--mode',
        'local',
        '--output',
        'json',
        'accounts',
        'create',
        '--user-id',
        '1',
        '--account-type-id',
        '1',
        '--name',
        'Wallet',
        '--initial-balance',
        '100000'
      ],
      env: {
        FORTUNA_ENV: 'PROD',
        FORTUNA_DB: process.env.FORTUNA_DB,
        FORTUNA_CLI_USER_ID: '1'
      }
    });

    assert.equal(accountCreate.exitCode, 0);
    const accountCreatePayload = parseOutput<{ ok: boolean; data: { account: { id: number } } }>(
      accountCreate.output
    );
    assert.equal(accountCreatePayload.ok, true);
    const accountId = accountCreatePayload.data.account.id;

    const secondAccountCreate = await runCli({
      argv: [
        '--mode',
        'local',
        '--output',
        'json',
        'accounts',
        'create',
        '--user-id',
        '1',
        '--account-type-id',
        '1',
        '--name',
        'Savings',
        '--initial-balance',
        '50000'
      ],
      env: {
        FORTUNA_ENV: 'PROD',
        FORTUNA_DB: process.env.FORTUNA_DB,
        FORTUNA_CLI_USER_ID: '1'
      }
    });

    assert.equal(secondAccountCreate.exitCode, 0);
    const secondAccountPayload = parseOutput<{ ok: boolean; data: { account: { id: number } } }>(
      secondAccountCreate.output
    );
    const secondAccountId = secondAccountPayload.data.account.id;

    const categoryCreate = await runCli({
      argv: [
        '--mode',
        'local',
        '--output',
        'json',
        'categories',
        'create',
        '--user-id',
        '1',
        '--category-group-id',
        '1',
        '--name',
        'Market',
        '--type',
        'expense'
      ],
      env: {
        FORTUNA_ENV: 'PROD',
        FORTUNA_DB: process.env.FORTUNA_DB,
        FORTUNA_CLI_USER_ID: '1'
      }
    });

    assert.equal(categoryCreate.exitCode, 0);
    const categoryPayload = parseOutput<{ ok: boolean; data: { category: { id: number } } }>(
      categoryCreate.output
    );
    const categoryId = categoryPayload.data.category.id;

    const transactionCreate = await runCli({
      argv: [
        '--mode',
        'local',
        '--output',
        'json',
        'transactions',
        'create',
        '--user-id',
        '1',
        '--account-id',
        String(accountId),
        '--category-id',
        String(categoryId),
        '--type',
        'expense',
        '--amount',
        '2500',
        '--date',
        '2026-05-16',
        '--description',
        'Integration Test Expense',
        '--status',
        'confirmed'
      ],
      env: {
        FORTUNA_ENV: 'PROD',
        FORTUNA_DB: process.env.FORTUNA_DB,
        FORTUNA_CLI_USER_ID: '1'
      }
    });

    assert.equal(transactionCreate.exitCode, 0);

    const transferCreate = await runCli({
      argv: [
        '--mode',
        'local',
        '--output',
        'json',
        'transfers',
        'create',
        '--user-id',
        '1',
        '--source-account-id',
        String(accountId),
        '--destination-account-id',
        String(secondAccountId),
        '--amount',
        '1000',
        '--date',
        '2026-05-16',
        '--status',
        'confirmed'
      ],
      env: {
        FORTUNA_ENV: 'PROD',
        FORTUNA_DB: process.env.FORTUNA_DB,
        FORTUNA_CLI_USER_ID: '1'
      }
    });

    assert.equal(transferCreate.exitCode, 0);

    const transactionList = await runCli({
      argv: ['--mode', 'local', '--output', 'json', 'transactions', 'list', '--user-id', '1'],
      env: {
        FORTUNA_ENV: 'PROD',
        FORTUNA_DB: process.env.FORTUNA_DB,
        FORTUNA_CLI_USER_ID: '1'
      }
    });

    assert.equal(transactionList.exitCode, 0);
    const txListPayload = parseOutput<{ ok: boolean; data: { data: unknown[]; total: number } }>(
      transactionList.output
    );
    assert.equal(txListPayload.ok, true);
    assert.ok(txListPayload.data.total >= 1);

    const reportSummary = await runCli({
      argv: ['--mode', 'local', '--output', 'json', 'reports', 'summary', '--user-id', '1'],
      env: {
        FORTUNA_ENV: 'PROD',
        FORTUNA_DB: process.env.FORTUNA_DB,
        FORTUNA_CLI_USER_ID: '1'
      }
    });

    assert.equal(reportSummary.exitCode, 0);
    const summaryPayload = parseOutput<{
      ok: boolean;
      data: {
        incomeTotal: number;
        expenseTotal: number;
        netFlow: number;
        confirmedTransfersIn: number;
        confirmedTransfersOut: number;
      };
    }>(reportSummary.output);

    assert.equal(summaryPayload.ok, true);
    assert.ok(typeof summaryPayload.data.expenseTotal === 'number');
    assert.ok(typeof summaryPayload.data.confirmedTransfersOut === 'number');
  } finally {
    await cleanup();
  }
});
