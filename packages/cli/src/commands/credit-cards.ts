import {
  createLocalCreditCardPurchase,
  listLocalCreditCards
} from '../adapters/local/credit-cards-client.js';
import {
  createRemoteCreditCardPurchase,
  listRemoteCreditCards
} from '../adapters/remote/credit-cards-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliCommandHandler } from './registry.js';

function asPositiveInt(value: string | undefined, flag: string): number {
  if (!value) throw new Error(`Missing required flag: ${flag}`);
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid value for ${flag}`);
  return n;
}

export const creditCardsListHandler: CliCommandHandler = {
  async execute(args, context) {
    const page = Number(getFlagValue(args, '--page') ?? '1');
    const page_size = Number(getFlagValue(args, '--page-size') ?? '20');
    if (context.mode === 'remote') {
      return listRemoteCreditCards(context, { page, page_size });
    }

    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    return listLocalCreditCards({ user_id, page, page_size });
  }
};

export const creditCardsPurchaseHandler: CliCommandHandler = {
  async execute(args, context) {
    const credit_card_id = asPositiveInt(getFlagValue(args, '--credit-card-id'), '--credit-card-id');
    const category_id = asPositiveInt(getFlagValue(args, '--category-id'), '--category-id');
    const total_amount = asPositiveInt(getFlagValue(args, '--total-amount'), '--total-amount');
    const installment_count = asPositiveInt(
      getFlagValue(args, '--installment-count'),
      '--installment-count'
    );
    const purchase_date = (getFlagValue(args, '--purchase-date') ?? '').trim();
    const description = (getFlagValue(args, '--description') ?? '').trim();
    const payeeFlag = getFlagValue(args, '--payee-id');
    const payee_id = payeeFlag ? asPositiveInt(payeeFlag, '--payee-id') : null;

    if (!purchase_date) throw new Error('Missing required flag: --purchase-date');
    if (!description) throw new Error('Missing required flag: --description');

    if (context.mode === 'remote') {
      const purchase = await createRemoteCreditCardPurchase(context, {
        credit_card_id,
        category_id,
        payee_id,
        description,
        total_amount,
        installment_count,
        purchase_date
      });
      return { purchase };
    }

    const purchase = await createLocalCreditCardPurchase({
      credit_card_id,
      category_id,
      payee_id,
      description,
      total_amount,
      installment_count,
      purchase_date
    });
    return { purchase };
  }
};

