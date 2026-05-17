import { strict as assert } from 'node:assert';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

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

async function waitForHealth(
  url: string,
  processRef: ChildProcessWithoutNullStreams,
  logs: { stdout: string[]; stderr: string[] },
  timeoutMs = 10_000
): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (processRef.exitCode !== null) {
      throw new Error(
        `API process exited before health check (code=${String(processRef.exitCode)}).\n` +
          `stdout:\n${logs.stdout.join('')}\n` +
          `stderr:\n${logs.stderr.join('')}`
      );
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // ignore and retry
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(
    `API health check timed out: ${url}\n` +
      `stdout:\n${logs.stdout.join('')}\n` +
      `stderr:\n${logs.stderr.join('')}`
  );
}

async function setupRemoteIntegrationEnvironment() {
  const projectRoot = fileURLToPath(new URL('../../..', import.meta.url));
  const dir = await mkdtemp(join(tmpdir(), 'fortuna-cli-remote-int-'));
  const dbPath = join(dir, 'remote-integration.db');
  const sessionPath = join(dir, 'session.json');
  const port = 3301;
  const apiBaseUrl = `http://localhost:${port}`;

  const dbModule = await loadDatabaseModule();
  await dbModule.reconcileMigrations({ databaseUrl: dbPath });

  const db = dbModule.createSqliteKysely({ databaseUrl: dbPath });
  await db.insertInto('users').values({
    id: 1,
    name: 'Remote Integration User',
    email: 'remote.integration@fortuna.local',
    password: 'remote-password'
  }).execute();
  await db.insertInto('account_types').values({ id: 1, name: 'Checking' }).execute();
  await db.insertInto('category_groups').values({ id: 1, user_id: 1, name: 'Expenses' }).execute();
  await db.insertInto('categories').values({
    id: 1,
    user_id: 1,
    category_group_id: 1,
    name: 'Bills',
    type: 'expense'
  }).execute();
  await db.destroy();

  const env = {
    ...process.env,
    FORTUNA_ENV: 'PROD',
    FORTUNA_DB: dbPath,
    FORTUNA_WEB_PORT: '4200',
    FORTUNA_API_PORT: String(port),
    FORTUNA_WEB_URL: 'http://localhost:4200',
    FORTUNA_API_BASE_URL: `${apiBaseUrl}/api/v1`,
    FORTUNA_JWT_SECRET: 'remote-integration-secret',
    FORTUNA_JWT_ACCESS_TOKEN_EXPIRES_IN: '1h'
  } as Record<string, string>;

  const apiProcess = spawn('node', [join(projectRoot, 'packages/api/dist/server.js')], {
    cwd: projectRoot,
    env,
    stdio: 'pipe'
  });
  const logs = { stdout: [] as string[], stderr: [] as string[] };
  apiProcess.stdout.on('data', (chunk: Buffer | string) => {
    logs.stdout.push(String(chunk));
  });
  apiProcess.stderr.on('data', (chunk: Buffer | string) => {
    logs.stderr.push(String(chunk));
  });

  await waitForHealth(`${apiBaseUrl}/health`, apiProcess, logs);

  const cleanup = async () => {
    await new Promise<void>((resolve) => {
      if (apiProcess.killed || apiProcess.exitCode !== null) {
        resolve();
        return;
      }

      apiProcess.once('exit', () => resolve());
      apiProcess.kill('SIGTERM');

      setTimeout(() => {
        if (apiProcess.exitCode === null) {
          apiProcess.kill('SIGKILL');
        }
      }, 1500);
    });

    await rm(dir, { recursive: true, force: true });
  };

  return { cleanup, apiBaseUrl, sessionPath, apiProcess, logs };
}

function parseOutput<T>(output: string): T {
  return JSON.parse(output) as T;
}

function assertProcessHealthy(processRef: ChildProcessWithoutNullStreams): void {
  if (processRef.exitCode !== null) {
    throw new Error(`API process exited early with code ${String(processRef.exitCode)}`);
  }
}

test('remote integration: auth + accounts + transactions + reports flow', async () => {
  const { cleanup, apiBaseUrl, sessionPath, apiProcess, logs } = await setupRemoteIntegrationEnvironment();

  try {
    assertProcessHealthy(apiProcess);

    const baseEnv = {
      FORTUNA_API_BASE_URL: apiBaseUrl,
      FORTUNA_CLI_SESSION_FILE: sessionPath
    };

    const login = await runCli({
      argv: [
        '--mode',
        'remote',
        '--output',
        'json',
        'auth',
        'login',
        '--email',
        'remote.integration@fortuna.local',
        '--password',
        'remote-password'
      ],
      env: baseEnv
    });

    assert.equal(login.exitCode, 0, `login failed: ${login.output}`);
    const loginPayload = parseOutput<{ ok: boolean }>(login.output);
    assert.equal(loginPayload.ok, true);

    const accountCreate = await runCli({
      argv: [
        '--mode',
        'remote',
        '--output',
        'json',
        'accounts',
        'create',
        '--account-type-id',
        '1',
        '--name',
        'Remote Checking',
        '--initial-balance',
        '250000'
      ],
      env: baseEnv
    });

    assert.equal(accountCreate.exitCode, 0);
    const accountPayload = parseOutput<{ ok: boolean; data: { account: { id: number } } }>(
      accountCreate.output
    );
    const accountId = accountPayload.data.account.id;

    const transactionCreate = await runCli({
      argv: [
        '--mode',
        'remote',
        '--output',
        'json',
        'transactions',
        'create',
        '--account-id',
        String(accountId),
        '--category-id',
        '1',
        '--type',
        'expense',
        '--amount',
        '9000',
        '--date',
        '2026-05-16',
        '--description',
        'Remote Integration Transaction',
        '--status',
        'confirmed'
      ],
      env: baseEnv
    });

    assert.equal(transactionCreate.exitCode, 0);

    const transactionList = await runCli({
      argv: ['--mode', 'remote', '--output', 'json', 'transactions', 'list', '--page', '1'],
      env: baseEnv
    });

    assert.equal(transactionList.exitCode, 0);
    const txListPayload = parseOutput<{ ok: boolean; data: { data: unknown[]; total: number } }>(
      transactionList.output
    );
    assert.equal(txListPayload.ok, true);
    assert.ok(txListPayload.data.total >= 1);

    const reportSummary = await runCli({
      argv: ['--mode', 'remote', '--output', 'json', 'reports', 'summary'],
      env: baseEnv
    });

    assert.equal(reportSummary.exitCode, 0);
    const summaryPayload = parseOutput<{ ok: boolean; data: Record<string, unknown> }>(
      reportSummary.output
    );

    assert.equal(summaryPayload.ok, true);
    const expenseTotal =
      (summaryPayload.data.expenseTotal as number | undefined) ??
      (summaryPayload.data.expense_total as number | undefined);
    assert.ok(typeof expenseTotal === 'number', `unexpected summary payload: ${reportSummary.output}`);
  } finally {
    if (apiProcess.exitCode !== null && apiProcess.exitCode !== 0) {
      // Helps debugging flaky failures in CI/dev logs.
      console.error(logs.stdout.join(''));
      console.error(logs.stderr.join(''));
    }
    await cleanup();
  }
});
