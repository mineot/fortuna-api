import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { CREDIT_CARD_STATEMENTS_CHANNELS } from './credit-card-statements.types';

export function registerCreditCardStatementsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'credit_card_statements', CREDIT_CARD_STATEMENTS_CHANNELS);
}
