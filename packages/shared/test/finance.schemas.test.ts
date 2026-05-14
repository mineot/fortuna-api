import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createAccountSchema,
  createCreditCardStatementPaymentSchema,
  createTransactionSchema,
  createTransferSchema,
  isoDateSchema,
  paginationSchema,
  updateAccountSchema,
  updateTransactionSchema,
} from '../src/index';

test('create schemas accept optional nullable fields', () => {
  const account = createAccountSchema.parse({
    user_id: 1,
    account_type_id: 2,
    name: 'Checking',
    initial_balance: 100000,
  });

  const transaction = createTransactionSchema.parse({
    user_id: 1,
    account_id: 2,
    category_id: 3,
    type: 'expense',
    description: 'Groceries',
    amount: 2590,
    date: '2026-05-13',
    status: 'confirmed',
  });

  assert.equal(account.notes, undefined);
  assert.equal(transaction.payee_id, undefined);
  assert.equal(transaction.notes, undefined);
});

test('update schemas allow partial payloads', () => {
  assert.deepEqual(updateAccountSchema.parse({}), {});
  assert.deepEqual(updateTransactionSchema.parse({ amount: 1500 }), { amount: 1500 });
});

test('create transfer keeps business rule and optional description', () => {
  assert.throws(
    () =>
      createTransferSchema.parse({
        user_id: 1,
        source_account_id: 10,
        destination_account_id: 10,
        amount: 1000,
        date: '2026-05-13',
        status: 'confirmed',
      }),
    /source_account_id and destination_account_id must be different/,
  );

  const transfer = createTransferSchema.parse({
    user_id: 1,
    source_account_id: 10,
    destination_account_id: 11,
    amount: 1000,
    date: '2026-05-13',
    status: 'confirmed',
  });

  assert.equal(transfer.description, undefined);
});

test('pagination schema is canonical and strict with snake_case', () => {
  assert.deepEqual(paginationSchema.parse({}), { page: 1, page_size: 20 });
  assert.deepEqual(paginationSchema.parse({ page: 2, page_size: 50 }), {
    page: 2,
    page_size: 50,
  });

  assert.throws(() => paginationSchema.parse({ page: 1, pageSize: 20 }), /Unrecognized key/);
});

test('common date validation rejects invalid calendar dates', () => {
  assert.equal(isoDateSchema.parse('2026-02-28'), '2026-02-28');
  assert.throws(() => isoDateSchema.parse('2026-02-29'), /Invalid ISO date/);
});

test('credit card statement payment input cannot include system transaction_id', () => {
  assert.throws(
    () =>
      createCreditCardStatementPaymentSchema.parse({
        credit_card_statement_id: 1,
        account_id: 2,
        amount: 10000,
        date: '2026-05-13',
        transaction_id: 99,
      }),
    /Unrecognized key/,
  );
});
