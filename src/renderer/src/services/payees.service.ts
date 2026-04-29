import type { NewPayee, Payee,PayeeUpdate } from '@db/schema';

class PayeesService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.payees.list(input);
  }

  listAll(): Promise<Payee[]> {
    return window.fortuna.payees.listAll() as Promise<Payee[]>;
  }

  findOne(id: number): Promise<Payee | undefined> {
    return window.fortuna.payees.findOne(id) as Promise<Payee | undefined>;
  }

  add(input: NewPayee): Promise<Payee> {
    return window.fortuna.payees.add(input) as Promise<Payee>;
  }

  change(input: { id: number; changes: Partial<PayeeUpdate> }): Promise<Payee | undefined> {
    return window.fortuna.payees.change(input) as Promise<Payee | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.payees.remove(id) as Promise<boolean>;
  }
}

export const payeesService = new PayeesService();
