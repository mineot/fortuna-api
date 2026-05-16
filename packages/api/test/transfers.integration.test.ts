import { after, test } from 'node:test';
import assert from 'node:assert/strict';

import { setupTestContext } from './helpers.js';
import { createSqliteKysely } from '@repo/database';
import type { Database as FortunaDatabase } from '@repo/shared';

const context = await setupTestContext();
after(async () => context.cleanup());

const seedTransferAccounts = async () => {
  const db = createSqliteKysely<FortunaDatabase>({ databaseUrl: context.dbPath });

  try {
    const accountType = await db
      .insertInto('account_types')
      .values({ name: 'TransferType' })
      .returning('id')
      .executeTakeFirstOrThrow();

    const source = await db
      .insertInto('accounts')
      .values({
        user_id: context.userId,
        account_type_id: accountType.id,
        name: 'Source',
        initial_balance: 0,
        notes: null,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const destination = await db
      .insertInto('accounts')
      .values({
        user_id: context.userId,
        account_type_id: accountType.id,
        name: 'Destination',
        initial_balance: 0,
        notes: null,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    return {
      sourceId: source.id,
      destinationId: destination.id,
    };
  } finally {
    await db.destroy();
  }
};

test('transfers flow: create and list by user', async () => {
  const accounts = await seedTransferAccounts();

  const createResponse = await context.app.request('/api/v1/transfers', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': String(context.userId),
    },
    body: JSON.stringify({
      source_account_id: accounts.sourceId,
      destination_account_id: accounts.destinationId,
      amount: 10000,
      date: '2026-02-02',
      description: 'Monthly transfer',
      status: 'confirmed',
    }),
  });

  assert.equal(createResponse.status, 201);

  const listResponse = await context.app.request('/api/v1/transfers?page=1&page_size=20', {
    method: 'GET',
    headers: {
      'x-user-id': String(context.userId),
    },
  });

  assert.equal(listResponse.status, 200);

  const listed = await listResponse.json();
  assert.ok(Array.isArray(listed.data));
  assert.ok(
    listed.data.some(
      (item: { source_account_id: number; destination_account_id: number }) =>
        item.source_account_id === accounts.sourceId &&
        item.destination_account_id === accounts.destinationId,
    ),
  );
});
