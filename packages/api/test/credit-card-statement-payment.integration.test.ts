import { after, test } from 'node:test';
import assert from 'node:assert/strict';

import { seedCreditCardStatementScenario, setupTestContext } from './helpers.js';

const context = await setupTestContext();
after(async () => context.cleanup());

test('credit card statement payment flow: register payment and mark statement as paid', async () => {
  const scenario = await seedCreditCardStatementScenario(context.dbPath, context.userId);

  const registerResponse = await context.app.request(
    `/api/v1/credit-card-statements/${scenario.statementId}/register-payment`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: context.authHeader,
      },
      body: JSON.stringify({
        account_id: scenario.accountId,
        amount: 5000,
        date: '2026-02-10',
        category_id: scenario.categoryId,
        description: 'Statement payment',
        payee_id: scenario.payeeId,
        notes: null,
        transaction_status: 'confirmed',
      }),
    },
  );

  assert.equal(registerResponse.status, 201);

  const registerPayload = await registerResponse.json();
  assert.equal(registerPayload.data.statementStatus, 'paid');
  assert.equal(registerPayload.data.statementTotal, 5000);
  assert.equal(registerPayload.data.statementPaidTotal, 5000);

  const totalsResponse = await context.app.request(
    `/api/v1/credit-card-statements/${scenario.statementId}/totals`,
    {
      method: 'GET',
      headers: {
        authorization: context.authHeader,
      },
    },
  );

  assert.equal(totalsResponse.status, 200);

  const totalsPayload = await totalsResponse.json();
  assert.equal(totalsPayload.data.statement_total, 5000);
  assert.equal(totalsPayload.data.statement_paid_total, 5000);
  assert.equal(totalsPayload.data.statement_remaining_total, 0);
});
