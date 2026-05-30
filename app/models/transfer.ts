import Account from '#models/account';
import Transaction from '#models/transaction';
import User from '#models/user';
import db from '@adonisjs/lucid/services/db';
import i18nManager from '@adonisjs/i18n/services/main';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import type { I18n } from '@adonisjs/i18n';
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
  locale?: string | null;
  i18n?: I18n;
};

export default class Transfer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare fromAccountId: number;

  @column()
  declare toAccountId: number;

  @column()
  declare outTransactionId: number | null;

  @column()
  declare inTransactionId: number | null;

  @column()
  declare amount: string;

  @column.date()
  declare transferDate: DateTime;

  @column()
  declare status: string;

  @column()
  declare description: string | null;

  @column()
  declare notes: string | null;

  @column()
  declare archived: boolean;

  @column.dateTime()
  declare archivedAt: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @belongsTo(() => Account, { foreignKey: 'fromAccountId' })
  declare fromAccount: BelongsTo<typeof Account>;

  @belongsTo(() => Account, { foreignKey: 'toAccountId' })
  declare toAccount: BelongsTo<typeof Account>;

  @belongsTo(() => Transaction, { foreignKey: 'outTransactionId' })
  declare outTransaction: BelongsTo<typeof Transaction>;

  @belongsTo(() => Transaction, { foreignKey: 'inTransactionId' })
  declare inTransaction: BelongsTo<typeof Transaction>;

  static async createTransfer(input: CreateTransferInput) {
    const resolvedLocale = input.locale
      ? i18nManager.getSupportedLocaleFor([input.locale]) || i18nManager.defaultLocale
      : i18nManager.defaultLocale;

    const i18n = input.i18n || i18nManager.locale(resolvedLocale);

    if (input.fromAccountId === input.toAccountId) {
      throw new Error(i18n.t('domain.transfer.sameAccount'));
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
        throw new Error(i18n.t('domain.transfer.invalidAmount'));
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
