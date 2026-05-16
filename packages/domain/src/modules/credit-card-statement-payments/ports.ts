import type {
  CreditCardStatementPaymentResponse,
  CreditCardStatementPaymentUpdate,
  NewCreditCardStatementPayment,
} from '@repo/shared';

export interface CreditCardStatementPaymentsListFilters {
  limit?: number;
  offset?: number;
  accountId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreditCardStatementPaymentsPort {
  create(payload: NewCreditCardStatementPayment): Promise<CreditCardStatementPaymentResponse>;
  findById(userId: number, paymentId: number): Promise<CreditCardStatementPaymentResponse | undefined>;
  listByStatement(userId: number, statementId: number, filters?: CreditCardStatementPaymentsListFilters): Promise<CreditCardStatementPaymentResponse[]>;
  updateById(userId: number, paymentId: number, payload: CreditCardStatementPaymentUpdate): Promise<CreditCardStatementPaymentResponse | undefined>;
  deleteById(userId: number, paymentId: number): Promise<boolean>;
}
