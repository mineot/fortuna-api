import Account from '#models/account';
import Transaction from '#models/transaction';
import Transfer from '#models/transfer';
import db from '@adonisjs/lucid/services/db';
import i18nManager from '@adonisjs/i18n/services/main';
import type { I18n } from '@adonisjs/i18n';
import type { DateTime } from 'luxon';
import { centsToMoney, toCents } from '#services/money';

export class TransferValidationError extends Error {
  constructor(
    public readonly code: 'same_account' | 'invalid_amount',
    message: string,
  ) {
    super(message);
    this.name = 'TransferValidationError';
  }
}

export type CreateTransferInput = {
  userId: number;
  fromAccountId: number;
  toAccountId: number;
  amount: string | number;
  transferDate: DateTime;
  description?: string | null;
  notes?: string | null;
  status?: string;
  locale?: string | null;
  i18n?: I18n;
};

export default class TransferService {
  async create(input: CreateTransferInput) {
    const resolvedLocale = input.locale
      ? i18nManager.getSupportedLocaleFor([input.locale]) || i18nManager.defaultLocale
      : i18nManager.defaultLocale;

    const i18n = input.i18n || i18nManager.locale(resolvedLocale);

    if (input.fromAccountId === input.toAccountId) {
      throw new TransferValidationError('same_account', i18n.t('domain.transfer.sameAccount'));
    }

    const trx = await db.transaction();

    try {
      const [fromAccount, toAccount] = await Promise.all([
        Account.query({ client: trx })
          .where('id', input.fromAccountId)
          .where('user_id', input.userId)
          .where('archived', false)
          .firstOrFail(),
        Account.query({ client: trx })
          .where('id', input.toAccountId)
          .where('user_id', input.userId)
          .where('archived', false)
          .firstOrFail(),
      ]);

      const transferCents = toCents(input.amount);

      if (transferCents <= 0n) {
        throw new TransferValidationError(
          'invalid_amount',
          i18n.t('domain.transfer.invalidAmount'),
        );
      }

      const transferAmount = centsToMoney(transferCents);

      const outTransaction = await Transaction.create(
        {
          userId: input.userId,
          accountId: fromAccount.id,
          categoryId: null,
          payeeId: null,
          type: 'transfer_out',
          amount: transferAmount,
          transactionDate: input.transferDate,
          status: input.status ?? 'posted',
          description: input.description ?? null,
          notes: input.notes ?? null,
          archived: false,
        },
        { client: trx },
      );

      const inTransaction = await Transaction.create(
        {
          userId: input.userId,
          accountId: toAccount.id,
          categoryId: null,
          payeeId: null,
          type: 'transfer_in',
          amount: transferAmount,
          transactionDate: input.transferDate,
          status: input.status ?? 'posted',
          description: input.description ?? null,
          notes: input.notes ?? null,
          archived: false,
        },
        { client: trx },
      );

      const transfer = await Transfer.create(
        {
          userId: input.userId,
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
          outTransactionId: outTransaction.id,
          inTransactionId: inTransaction.id,
          amount: transferAmount,
          transferDate: input.transferDate,
          status: input.status ?? 'posted',
          description: input.description ?? null,
          notes: input.notes ?? null,
          archived: false,
        },
        { client: trx },
      );

      fromAccount.currentBalance = centsToMoney(
        toCents(fromAccount.currentBalance) - transferCents,
      );

      toAccount.currentBalance = centsToMoney(toCents(toAccount.currentBalance) + transferCents);

      await fromAccount.useTransaction(trx).save();
      await toAccount.useTransaction(trx).save();

      await trx.commit();
      return transfer;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
