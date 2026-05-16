import { after, test } from 'node:test';
import assert from 'node:assert/strict';

import { seedBaseFinancialData, setupTestContext } from './helpers.js';

const context = await setupTestContext();
after(async () => context.cleanup());

test('transactions flow: create and list by user', async () => {
  const base = await seedBaseFinancialData(context.dbPath, context.userId);

  const createResponse = await context.app.request('/api/v1/transactions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': String(context.userId),
    },
    body: JSON.stringify({
      account_id: base.accountId,
      category_id: base.categoryId,
      payee_id: base.payeeId,
      type: 'expense',
      description: 'Lunch',
      amount: 2500,
      date: '2026-02-01',
      status: 'confirmed',
      notes: null,
    }),
  });

  assert.equal(createResponse.status, 201);

  const created = await createResponse.json();
  assert.equal(created.data.description, 'Lunch');

  const listResponse = await context.app.request('/api/v1/transactions?page=1&page_size=20', {
    method: 'GET',
    headers: {
      'x-user-id': String(context.userId),
    },
  });

  assert.equal(listResponse.status, 200);

  const listed = await listResponse.json();
  assert.ok(Array.isArray(listed.data));
  assert.ok(listed.data.some((item: { description: string }) => item.description === 'Lunch'));
});
