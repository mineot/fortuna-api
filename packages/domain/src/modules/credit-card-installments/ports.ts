import type {
  CreditCardInstallmentResponse,
  CreditCardInstallmentUpdate,
  NewCreditCardInstallment,
} from '@repo/shared';

export interface CreditCardInstallmentsListFilters {
  limit?: number;
  offset?: number;
  statementId?: number;
  competenceDateFrom?: string;
  competenceDateTo?: string;
}

export interface CreditCardInstallmentsPort {
  create(payload: NewCreditCardInstallment): Promise<CreditCardInstallmentResponse>;
  findById(userId: number, installmentId: number): Promise<CreditCardInstallmentResponse | undefined>;
  listByPurchase(userId: number, purchaseId: number, filters?: CreditCardInstallmentsListFilters): Promise<CreditCardInstallmentResponse[]>;
  updateById(userId: number, installmentId: number, payload: CreditCardInstallmentUpdate): Promise<CreditCardInstallmentResponse | undefined>;
  deleteById(userId: number, installmentId: number): Promise<boolean>;
}
