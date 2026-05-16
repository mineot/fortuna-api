import type { NewPayee, PayeeResponse, PayeeUpdate } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { PayeesListFilters, PayeesPort } from '../ports.js';

export const createPayeesUseCases = (payees: PayeesPort) => ({
  create: (payload: NewPayee): Promise<PayeeResponse> => payees.create(payload),
  findById: async (userId: number, payeeId: number): Promise<PayeeResponse> => {
    const payee = await payees.findById(userId, payeeId);
    if (!payee) throw new DomainError({ code: 'PAYEE_NOT_FOUND', message: 'Payee not found.' });
    return payee;
  },
  listByUser: (userId: number, filters: PayeesListFilters): Promise<PayeeResponse[]> => payees.listByUser(userId, filters),
  updateById: async (userId: number, payeeId: number, payload: PayeeUpdate): Promise<PayeeResponse> => {
    const payee = await payees.updateById(userId, payeeId, payload);
    if (!payee) throw new DomainError({ code: 'PAYEE_NOT_FOUND', message: 'Payee not found.' });
    return payee;
  },
  deleteById: async (userId: number, payeeId: number): Promise<void> => {
    const deleted = await payees.deleteById(userId, payeeId);
    if (!deleted) throw new DomainError({ code: 'PAYEE_NOT_FOUND', message: 'Payee not found.' });
  },
});
