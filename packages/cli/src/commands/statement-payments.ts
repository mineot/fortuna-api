import {
  createLocalStatementPayment
} from '../adapters/local/statement-payments-client.js';
import {
  createRemoteStatementPayment
} from '../adapters/remote/statement-payments-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliCommandHandler } from './registry.js';

type TransactionStatus = 'pending' | 'confirmed' | 'cancelled';

function asPositiveInt(value: string | undefined, flag: string): number {
  if (!value) throw new Error(`Missing required flag: ${flag}`);
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid value for ${flag}`);
  return n;
}

function asStatus(value: string | undefined): TransactionStatus | undefined {
  if (!value) return undefined;
  if (value === 'pending' || value === 'confirmed' || value === 'cancelled') return value;
  throw new Error('Invalid --transaction-status. Use pending, confirmed or cancelled.');
}

export const statementPaymentsCreateHandler: CliCommandHandler = {
  async execute(args, context) {
    const credit_card_statement_id = asPositiveInt(
      getFlagValue(args, '--credit-card-statement-id'),
      '--credit-card-statement-id'
    );
    const account_id = asPositiveInt(getFlagValue(args, '--account-id'), '--account-id');
    const amount = asPositiveInt(getFlagValue(args, '--amount'), '--amount');
    const category_id = asPositiveInt(getFlagValue(args, '--category-id'), '--category-id');
    const date = (getFlagValue(args, '--date') ?? '').trim();
    const description =
      (getFlagValue(args, '--description') ?? '').trim() || 'Credit card statement payment';
    const payeeFlag = getFlagValue(args, '--payee-id');
    const notes = getFlagValue(args, '--notes') ?? null;
    const transaction_status = asStatus(getFlagValue(args, '--transaction-status'));
    const payee_id = payeeFlag ? asPositiveInt(payeeFlag, '--payee-id') : null;

    if (!date) throw new Error('Missing required flag: --date');

    if (context.mode === 'remote') {
      const result = await createRemoteStatementPayment(context, {
        credit_card_statement_id,
        account_id,
        amount,
        date,
        category_id,
        description,
        payee_id,
        notes,
        ...(transaction_status ? { transaction_status } : {})
      });
      return { payment: result };
    }

    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    const result = await createLocalStatementPayment({
      user_id,
      credit_card_statement_id,
      account_id,
      amount,
      date,
      category_id,
      description,
      payee_id,
      notes,
      ...(transaction_status ? { transaction_status } : {})
    });
    return { payment: result };
  }
};

