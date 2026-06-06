import Account from '#models/account';
import Category from '#models/category';
import Payee from '#models/payee';
import Transaction from '#models/transaction';
import Transfer from '#models/transfer';
import { createTransactionValidator, updateTransactionValidator } from '#validators/transaction';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';
import { money } from '#services/money';
import { tHttp } from '#services/http_i18n';

export default class TransactionsController {
  private parseTransactionDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  private formatMoney(value: number) {
    return money(value);
  }

  private async hasTransferLink(transactionId: number) {
    const linked = await Transfer.query()
      .where('out_transaction_id', transactionId)
      .orWhere('in_transaction_id', transactionId)
      .first();

    return !!linked;
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const transactions = await Transaction.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('account')
      .preload('category')
      .preload('payee')
      .orderBy('transaction_date', 'desc')
      .orderBy('id', 'desc');

    return response.ok({ data: transactions });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createTransactionValidator);
    const transactionDate = this.parseTransactionDate(payload.transactionDate);

    if (!transactionDate) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'Invalid transaction date') });
    }

    const account = await Account.query()
      .where('id', payload.accountId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!account) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Account not found for this user'),
      });
    }

    if (payload.categoryId !== undefined && payload.categoryId !== null) {
      const category = await Category.query()
        .where('id', payload.categoryId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!category) {
        return response.unprocessableEntity({
          message: tHttp(i18n, 'Category not found for this user'),
        });
      }
    }

    if (payload.payeeId !== undefined && payload.payeeId !== null) {
      const payee = await Payee.query()
        .where('id', payload.payeeId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!payee) {
        return response.unprocessableEntity({
          message: tHttp(i18n, 'Payee not found for this user'),
        });
      }
    }

    const transaction = await Transaction.create({
      userId,
      accountId: payload.accountId,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      type: payload.type,
      amount: this.formatMoney(payload.amount),
      transactionDate,
      status: payload.status ?? 'posted',
      description: payload.description,
      notes: payload.notes,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: transaction });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!transaction) {
      return response.notFound({ message: tHttp(i18n, 'Transaction not found') });
    }

    if (
      transaction.type === 'transfer_out' ||
      transaction.type === 'transfer_in' ||
      (await this.hasTransferLink(transaction.id))
    ) {
      return response.conflict({
        message: tHttp(i18n, 'Transfer transactions cannot be updated through this endpoint'),
      });
    }

    const payload = await request.validateUsing(updateTransactionValidator);
    const transactionDate = this.parseTransactionDate(payload.transactionDate);

    if (!transactionDate) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'Invalid transaction date') });
    }

    const account = await Account.query()
      .where('id', payload.accountId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!account) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Account not found for this user'),
      });
    }

    if (payload.categoryId !== undefined && payload.categoryId !== null) {
      const category = await Category.query()
        .where('id', payload.categoryId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!category) {
        return response.unprocessableEntity({
          message: tHttp(i18n, 'Category not found for this user'),
        });
      }
    }

    if (payload.payeeId !== undefined && payload.payeeId !== null) {
      const payee = await Payee.query()
        .where('id', payload.payeeId)
        .where('user_id', userId)
        .where('archived', false)
        .first();

      if (!payee) {
        return response.unprocessableEntity({
          message: tHttp(i18n, 'Payee not found for this user'),
        });
      }
    }

    transaction.merge({
      accountId: payload.accountId,
      categoryId: payload.categoryId ?? null,
      payeeId: payload.payeeId ?? null,
      type: payload.type,
      amount: this.formatMoney(payload.amount),
      transactionDate,
      status: payload.status,
      description: payload.description,
      notes: payload.notes,
    });

    await transaction.save();

    return response.ok({ data: transaction });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!transaction) {
      return response.notFound({ message: tHttp(i18n, 'Transaction not found') });
    }

    if (
      transaction.type === 'transfer_out' ||
      transaction.type === 'transfer_in' ||
      (await this.hasTransferLink(transaction.id))
    ) {
      return response.conflict({
        message: tHttp(i18n, 'Transfer transactions cannot be archived through this endpoint'),
      });
    }

    if (!transaction.archived) {
      transaction.archived = true;
      transaction.archivedAt = DateTime.now();
      await transaction.save();
    }

    return response.ok({ data: transaction });
  }
}
