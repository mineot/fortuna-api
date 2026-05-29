import Account from '#models/account';
import Transaction from '#models/transaction';
import Transfer from '#models/transfer';
import db from '@adonisjs/lucid/services/db';
import { DateTime } from 'luxon';

export type CreateTransferInput = {
  userId: number;
  fromAccountId: number;
  toAccountId: number;
  amount: string | number;
  transferDate: DateTime;
  description?: string | null;
  notes?: string | null;
  status?: string;
};

export default class TransferService {
  async create(input: CreateTransferInput) {
    if (input.fromAccountId === input.toAccountId) {
      throw new Error('Origin and destination accounts must be different');
    }

    const trx = await db.transaction();

    try {
      const [fromAccount, toAccount] = await Promise.all([
        Account.query({ client: trx })
          .where('id', input.fromAccountId)
          .where('user_id', input.userId)
          .firstOrFail(),
        Account.query({ client: trx })
          .where('id', input.toAccountId)
          .where('user_id', input.userId)
          .firstOrFail(),
      ]);

      const transferAmount = Number(input.amount);
      if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
        throw new Error('Transfer amount must be greater than zero');
      }

      const outTransaction = await Transaction.create(
        {
          userId: input.userId,
          accountId: fromAccount.id,
          categoryId: null,
          payeeId: null,
          type: 'transfer_out',
          amount: transferAmount.toFixed(2),
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
          amount: transferAmount.toFixed(2),
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
          amount: transferAmount.toFixed(2),
          transferDate: input.transferDate,
          status: input.status ?? 'posted',
          description: input.description ?? null,
          notes: input.notes ?? null,
          archived: false,
        },
        { client: trx },
      );

      fromAccount.currentBalance = (Number(fromAccount.currentBalance) - transferAmount).toFixed(2);
      toAccount.currentBalance = (Number(toAccount.currentBalance) + transferAmount).toFixed(2);

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
