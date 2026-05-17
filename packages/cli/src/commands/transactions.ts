import {
  createLocalTransaction,
  listLocalTransactions
} from '../adapters/local/transactions-client.js';
import {
  createRemoteTransaction,
  listRemoteTransactions
} from '../adapters/remote/transactions-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliCommandHandler } from './registry.js';

type TransactionType = 'income' | 'expense';
type TransactionStatus = 'pending' | 'confirmed' | 'cancelled';

function asNumber(value: string | undefined, flagName: string): number {
  if (!value) {
    throw new Error(`Missing required flag: ${flagName}`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid value for ${flagName}. Expected positive integer.`);
  }

  return parsed;
}

function getLocalUserId(args: readonly string[], defaultUserId: number): number {
  const fromFlag = getFlagValue(args, '--user-id');
  return fromFlag ? asNumber(fromFlag, '--user-id') : defaultUserId;
}

export const transactionsCreateHandler: CliCommandHandler = {
  async execute(args, context) {
    const payload = {
      user_id: getLocalUserId(args, context.config.localUserId),
      account_id: asNumber(getFlagValue(args, '--account-id'), '--account-id'),
      category_id: asNumber(getFlagValue(args, '--category-id'), '--category-id'),
      payee_id: getFlagValue(args, '--payee-id')
        ? asNumber(getFlagValue(args, '--payee-id'), '--payee-id')
        : null,
      type: (getFlagValue(args, '--type') ?? '') as TransactionType,
      description: getFlagValue(args, '--description') ?? '',
      amount: asNumber(getFlagValue(args, '--amount'), '--amount'),
      date: getFlagValue(args, '--date') ?? '',
      status: (getFlagValue(args, '--status') ?? '') as TransactionStatus,
      notes: getFlagValue(args, '--notes') ?? null
    };

    if (!['income', 'expense'].includes(payload.type)) {
      throw new Error('Invalid --type. Use income or expense.');
    }
    if (!['pending', 'confirmed', 'cancelled'].includes(payload.status)) {
      throw new Error('Invalid --status. Use pending, confirmed or cancelled.');
    }
    if (!payload.description.trim()) {
      throw new Error('Missing required flag: --description');
    }
    if (!payload.date.trim()) {
      throw new Error('Missing required flag: --date');
    }

    if (context.mode === 'remote') {
      const created = await createRemoteTransaction(context, payload);
      return { transaction: created };
    }

    const created = await createLocalTransaction(payload);
    return { transaction: created };
  }
};

export const transactionsListHandler: CliCommandHandler = {
  async execute(args, context) {
    const accountIdFlag = getFlagValue(args, '--account-id');
    const categoryIdFlag = getFlagValue(args, '--category-id');
    const payeeIdFlag = getFlagValue(args, '--payee-id');
    const typeFlag = getFlagValue(args, '--type');
    const statusFlag = getFlagValue(args, '--status');
    const fromFlag = getFlagValue(args, '--from');
    const toFlag = getFlagValue(args, '--to');

    const queryBase = {
      user_id: getLocalUserId(args, context.config.localUserId),
      page: Number(getFlagValue(args, '--page') ?? '1'),
      page_size: Number(getFlagValue(args, '--page-size') ?? '20'),
      ...(accountIdFlag ? { account_id: asNumber(accountIdFlag, '--account-id') } : {}),
      ...(categoryIdFlag ? { category_id: asNumber(categoryIdFlag, '--category-id') } : {}),
      ...(payeeIdFlag ? { payee_id: asNumber(payeeIdFlag, '--payee-id') } : {}),
      ...(typeFlag ? { type: typeFlag as TransactionType } : {}),
      ...(statusFlag ? { status: statusFlag as TransactionStatus } : {}),
      ...(fromFlag ? { date_from: fromFlag } : {}),
      ...(toFlag ? { date_to: toFlag } : {})
    };

    if (context.mode === 'remote') {
      return listRemoteTransactions(context, queryBase);
    }

    return listLocalTransactions(queryBase);
  }
};
