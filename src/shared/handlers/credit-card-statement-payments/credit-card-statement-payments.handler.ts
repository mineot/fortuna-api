import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register-crud';
import { CREDIT_CARD_STATEMENT_PAYMENTS_CHANNELS } from './credit-card-statement-payments.types';

export function registerCreditCardStatementPaymentsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'credit_card_statement_payments', CREDIT_CARD_STATEMENT_PAYMENTS_CHANNELS);
}
