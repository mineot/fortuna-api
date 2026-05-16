import type {
  CreditCardStatementPaymentResponse,
  CreditCardStatementPaymentUpdate,
  NewCreditCardStatementPayment,
} from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { CreditCardStatementPaymentsListFilters, CreditCardStatementPaymentsPort } from '../ports.js';

export const createCreditCardStatementPaymentsUseCases = (
  creditCardStatementPayments: CreditCardStatementPaymentsPort,
) => ({
  create: (payload: NewCreditCardStatementPayment): Promise<CreditCardStatementPaymentResponse> =>
    creditCardStatementPayments.create(payload),
  findById: async (userId: number, paymentId: number): Promise<CreditCardStatementPaymentResponse> => {
    const payment = await creditCardStatementPayments.findById(userId, paymentId);
    if (!payment) throw new DomainError({ code: 'CREDIT_CARD_STATEMENT_PAYMENT_NOT_FOUND', message: 'Credit card statement payment not found.' });
    return payment;
  },
  listByStatement: (
    userId: number,
    statementId: number,
    filters: CreditCardStatementPaymentsListFilters,
  ): Promise<CreditCardStatementPaymentResponse[]> =>
    creditCardStatementPayments.listByStatement(userId, statementId, filters),
  updateById: async (
    userId: number,
    paymentId: number,
    payload: CreditCardStatementPaymentUpdate,
  ): Promise<CreditCardStatementPaymentResponse> => {
    const payment = await creditCardStatementPayments.updateById(userId, paymentId, payload);
    if (!payment) throw new DomainError({ code: 'CREDIT_CARD_STATEMENT_PAYMENT_NOT_FOUND', message: 'Credit card statement payment not found.' });
    return payment;
  },
  deleteById: async (userId: number, paymentId: number): Promise<void> => {
    const deleted = await creditCardStatementPayments.deleteById(userId, paymentId);
    if (!deleted) throw new DomainError({ code: 'CREDIT_CARD_STATEMENT_PAYMENT_NOT_FOUND', message: 'Credit card statement payment not found.' });
  },
});
