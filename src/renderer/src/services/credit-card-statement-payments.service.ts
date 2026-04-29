import type { CreditCardStatementPayment,CreditCardStatementPaymentUpdate, NewCreditCardStatementPayment } from '@db/schema';

class CreditCardStatementPaymentsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.creditCardStatementPayments.list(input);
  }

  listAll(): Promise<CreditCardStatementPayment[]> {
    return window.fortuna.creditCardStatementPayments.listAll() as Promise<CreditCardStatementPayment[]>;
  }

  findOne(id: number): Promise<CreditCardStatementPayment | undefined> {
    return window.fortuna.creditCardStatementPayments.findOne(id) as Promise<CreditCardStatementPayment | undefined>;
  }

  add(input: NewCreditCardStatementPayment): Promise<CreditCardStatementPayment> {
    return window.fortuna.creditCardStatementPayments.add(input) as Promise<CreditCardStatementPayment>;
  }

  change(input: { id: number; changes: Partial<CreditCardStatementPaymentUpdate> }): Promise<CreditCardStatementPayment | undefined> {
    return window.fortuna.creditCardStatementPayments.change(input) as Promise<CreditCardStatementPayment | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.creditCardStatementPayments.remove(id) as Promise<boolean>;
  }
}

export const creditCardStatementPaymentsService = new CreditCardStatementPaymentsService();
