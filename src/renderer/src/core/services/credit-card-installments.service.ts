import type { CreditCardInstallment,CreditCardInstallmentUpdate, NewCreditCardInstallment } from '@db/schema';

class CreditCardInstallmentsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.creditCardInstallments.list(input);
  }

  listAll(): Promise<CreditCardInstallment[]> {
    return window.fortuna.creditCardInstallments.listAll() as Promise<CreditCardInstallment[]>;
  }

  findOne(id: number): Promise<CreditCardInstallment | undefined> {
    return window.fortuna.creditCardInstallments.findOne(id) as Promise<CreditCardInstallment | undefined>;
  }

  add(input: NewCreditCardInstallment): Promise<CreditCardInstallment> {
    return window.fortuna.creditCardInstallments.add(input) as Promise<CreditCardInstallment>;
  }

  change(input: { id: number; changes: Partial<CreditCardInstallmentUpdate> }): Promise<CreditCardInstallment | undefined> {
    return window.fortuna.creditCardInstallments.change(input) as Promise<CreditCardInstallment | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.creditCardInstallments.remove(id) as Promise<boolean>;
  }
}

export const creditCardInstallmentsService = new CreditCardInstallmentsService();
