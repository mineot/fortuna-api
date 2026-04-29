import type { CreditCardStatement,CreditCardStatementUpdate, NewCreditCardStatement } from '@db/schema';

class CreditCardStatementsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.creditCardStatements.list(input);
  }

  listAll(): Promise<CreditCardStatement[]> {
    return window.fortuna.creditCardStatements.listAll() as Promise<CreditCardStatement[]>;
  }

  findOne(id: number): Promise<CreditCardStatement | undefined> {
    return window.fortuna.creditCardStatements.findOne(id) as Promise<CreditCardStatement | undefined>;
  }

  add(input: NewCreditCardStatement): Promise<CreditCardStatement> {
    return window.fortuna.creditCardStatements.add(input) as Promise<CreditCardStatement>;
  }

  change(input: { id: number; changes: Partial<CreditCardStatementUpdate> }): Promise<CreditCardStatement | undefined> {
    return window.fortuna.creditCardStatements.change(input) as Promise<CreditCardStatement | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.creditCardStatements.remove(id) as Promise<boolean>;
  }
}

export const creditCardStatementsService = new CreditCardStatementsService();
