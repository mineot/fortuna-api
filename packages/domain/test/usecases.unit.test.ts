import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  DomainError,
  createCreatePurchaseWithInstallmentsUseCase,
  createCreateTransferUseCase,
  createCreateUserUseCase,
  createLoginUseCase,
  createRegisterStatementPaymentUseCase,
} from '../src/index.ts';

describe('domain use cases', () => {
  it('login: returns access token when credentials are valid', async () => {
    const login = createLoginUseCase({
      users: {
        findByEmail: async () => ({ id: 10, name: 'Seed User', email: 'seed@fortuna.local', password: 'hash' }),
        findById: async () => undefined,
      },
      passwordHasher: {
        verify: async (plainText, hash) => plainText === 'secret' && hash === 'hash',
      },
      tokenSigner: {
        sign: async (userId) => `token-${userId}`,
      },
    });

    const result = await login({ email: 'seed@fortuna.local', password: 'secret' });

    assert.equal(result.access_token, 'token-10');
  });

  it('create user: throws conflict when email already exists', async () => {
    const createUser = createCreateUserUseCase({
      users: {
        findById: async () => undefined,
        findByEmail: async () => ({ id: 1, name: 'Existing', email: 'existing@fortuna.local', password: 'x' }),
        create: async () => {
          throw new Error('should not create');
        },
        updateById: async () => undefined,
        deleteById: async () => false,
      },
    });

    await assert.rejects(
      () => createUser({ name: 'New', email: 'existing@fortuna.local', password: '12345678' }),
      (error: unknown) => {
        assert.ok(error instanceof DomainError);
        assert.equal(error.code, 'USER_EMAIL_CONFLICT');
        return true;
      },
    );
  });

  it('create transfer: rejects source and destination as the same account', async () => {
    const createTransfer = createCreateTransferUseCase({
      transfers: {
        create: async () => {
          throw new Error('should not create');
        },
      },
    });

    await assert.rejects(
      () =>
        createTransfer({
          user_id: 1,
          source_account_id: 9,
          destination_account_id: 9,
          amount: 1000,
          date: '2026-05-16',
          description: null,
          status: 'confirmed',
        }),
      (error: unknown) => {
        assert.ok(error instanceof DomainError);
        assert.equal(error.code, 'TRANSFER_SAME_ACCOUNT');
        return true;
      },
    );
  });

  it('credit card purchase with installments: rejects mismatched totals', async () => {
    const createPurchaseWithInstallments = createCreatePurchaseWithInstallmentsUseCase({
      creditCards: {
        registerStatementPayment: async () => {
          throw new Error('should not register payment');
        },
        createPurchaseWithInstallments: async () => {
          throw new Error('should not create purchase');
        },
      },
    });

    await assert.rejects(
      () =>
        createPurchaseWithInstallments({
          userId: 1,
          creditCardId: 1,
          payload: {
            category_id: 1,
            payee_id: null,
            description: 'Notebook',
            total_amount: 10000,
            installment_count: 2,
            purchase_date: '2026-05-16',
            installments: [
              {
                credit_card_statement_id: 11,
                installment_number: 1,
                amount: 7000,
                competence_date: '2026-06-01',
              },
              {
                credit_card_statement_id: 12,
                installment_number: 2,
                amount: 2000,
                competence_date: '2026-07-01',
              },
            ],
          },
        }),
      (error: unknown) => {
        assert.ok(error instanceof DomainError);
        assert.equal(error.code, 'CREDIT_CARD_PURCHASE_INSTALLMENT_SUM_MISMATCH');
        return true;
      },
    );
  });

  it('register statement payment: rejects non-positive amount', async () => {
    const registerPayment = createRegisterStatementPaymentUseCase({
      creditCards: {
        createPurchaseWithInstallments: async () => {
          throw new Error('not used');
        },
        registerStatementPayment: async () => {
          throw new Error('should not register');
        },
      },
    });

    await assert.rejects(
      () =>
        registerPayment({
          userId: 1,
          statementId: 2,
          accountId: 3,
          amount: 0,
          date: '2026-05-16',
          categoryId: 4,
          description: 'Payment',
          payeeId: null,
          notes: null,
          transactionStatus: 'confirmed',
        }),
      (error: unknown) => {
        assert.ok(error instanceof DomainError);
        assert.equal(error.code, 'CREDIT_CARD_STATEMENT_PAYMENT_INVALID_AMOUNT');
        return true;
      },
    );
  });
});
